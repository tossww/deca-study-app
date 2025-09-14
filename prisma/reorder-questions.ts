import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import csvParser from 'csv-parser'

const prisma = new PrismaClient()

interface CSVQuestion {
  test_number: string
  exam_title: string
  source_pdf: string
  question_number: string
  question_text: string
  option_A: string
  option_B: string
  option_C: string
  option_D: string
  correct_letter: string
  correct_option_text: string
  rationale: string
}

// Function to read CSV file and parse questions
function readCSVFile(filePath: string): Promise<CSVQuestion[]> {
  return new Promise((resolve, reject) => {
    const results: CSVQuestion[] = []

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data: CSVQuestion) => {
        results.push(data)
      })
      .on('end', () => {
        resolve(results)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}

// Function to extract topic name from file name
function getTopicFromFileName(fileName: string): string {
  if (fileName.includes('Business_Management_and_Administration')) return 'Business Management & Administration'
  if (fileName.includes('Marketing')) return 'Marketing'
  if (fileName.includes('Finance')) return 'Finance'
  if (fileName.includes('Entrepreneurship')) return 'Entrepreneurship'
  if (fileName.includes('Hospitality_and_Tourism')) return 'Hospitality & Tourism'
  return 'Unknown'
}

// Function to determine difficulty based on question complexity
function estimateDifficulty(questionText: string, rationale: string): number {
  const textLength = questionText.length + rationale.length
  const complexWords = (questionText.match(/\b(analyze|evaluate|synthesize|compare|contrast|implement|strategic|comprehensive)\b/gi) || []).length

  if (textLength > 800 || complexWords > 2) return 3 // Hard
  if (textLength > 400 || complexWords > 0) return 2 // Medium
  return 1 // Easy
}

async function main() {
  console.log('🚀 Starting question reordering...')

  // First, get all topics
  const topics = await prisma.topic.findMany()
  const topicMap = new Map(topics.map(t => [t.name, t]))

  // Clear existing related data that depends on question IDs
  console.log('🧹 Clearing dependent data...')
  await prisma.sessionItem.deleteMany({})
  await prisma.questionStat.deleteMany({})
  await prisma.note.deleteMany({})

  // Delete all questions
  console.log('🧹 Clearing existing questions...')
  await prisma.question.deleteMany({})

  // Path to CSV files (relative to project root)
  const csvDirectory = path.join(__dirname, '../../resource')
  const csvFiles = [
    'Business_Management_and_Administration_Sample_Exam_questions_with_rationales_FIXED.csv',
    'Marketing_Sample_Exam_questions_with_rationales_FIXED.csv',
    'Finance_Sample_Exam_questions_with_rationales_FIXED.csv',
    'Entrepreneurship_Sample_Exam_questions_with_rationales_FIXED.csv',
    'Hospitality_and_Tourism_Sample_Exam_questions_with_rationales_FIXED.csv'
  ]

  let globalId = 1  // Start with ID 1 and increment for each question

  // Process each CSV file in order
  for (const csvFile of csvFiles) {
    const filePath = path.join(csvDirectory, csvFile)

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  CSV file not found: ${filePath}`)
      continue
    }

    console.log(`📖 Processing ${csvFile}...`)

    try {
      const questions = await readCSVFile(filePath)
      const topicName = getTopicFromFileName(csvFile)
      const topic = topicMap.get(topicName)

      if (!topic) {
        console.error(`❌ Topic not found for file: ${csvFile}`)
        continue
      }

      let questionsAdded = 0

      // Process each question from the CSV in order
      for (const csvQuestion of questions) {
        // Skip if essential data is missing
        if (!csvQuestion.question_text || !csvQuestion.correct_letter) {
          console.warn(`⚠️  Skipping incomplete question: ${csvQuestion.question_number}`)
          continue
        }

        const difficulty = estimateDifficulty(csvQuestion.question_text, csvQuestion.rationale || '')

        // Create question with specific ID
        await prisma.$executeRaw`
          INSERT INTO Question (
            id, refId, questionText, optionA, optionB, optionC, optionD,
            correctAnswer, explanation, difficulty, topicId, createdAt
          ) VALUES (
            ${globalId},
            ${parseInt(csvQuestion.test_number) || questionsAdded + 1},
            ${csvQuestion.question_text.trim()},
            ${csvQuestion.option_A?.trim() || ''},
            ${csvQuestion.option_B?.trim() || ''},
            ${csvQuestion.option_C?.trim() || ''},
            ${csvQuestion.option_D?.trim() || ''},
            ${csvQuestion.correct_letter.trim().toUpperCase()},
            ${csvQuestion.rationale?.trim() || 'No explanation provided.'},
            ${difficulty},
            ${topic.id},
            ${new Date().toISOString()}
          )
        `

        globalId++
        questionsAdded++
      }

      console.log(`✅ Added ${questionsAdded} questions for ${topicName} (IDs ${globalId - questionsAdded} to ${globalId - 1})`)

    } catch (error) {
      console.error(`❌ Error processing ${csvFile}:`, error)
    }
  }

  // Update the SQLite sequence to match our last ID
  await prisma.$executeRaw`UPDATE sqlite_sequence SET seq = ${globalId - 1} WHERE name = 'Question'`

  console.log(`\n🎉 Questions reordered successfully!`)
  console.log(`📊 Summary:`)
  console.log(`   - Total questions: ${globalId - 1}`)
  console.log(`   - Questions now have sequential IDs matching CSV order`)
}

main()
  .catch((e) => {
    console.error('❌ Reordering failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })