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
  console.log('🚀 Starting CSV-based database seeding...')

  // Create topics first
  const topics = [
    { name: 'Business Management & Administration', description: 'Core business principles and management concepts' },
    { name: 'Marketing', description: 'Marketing strategies, consumer behavior, and brand management' },
    { name: 'Finance', description: 'Financial planning, investments, and economic principles' },
    { name: 'Entrepreneurship', description: 'Starting and running a business, innovation and risk management' },
    { name: 'Hospitality & Tourism', description: 'Travel, tourism industry, and hospitality management' }
  ]

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.sessionItem.deleteMany({})
  await prisma.questionStat.deleteMany({})
  await prisma.note.deleteMany({})
  await prisma.question.deleteMany({})
  await prisma.topic.deleteMany({})

  const createdTopics = []
  for (const topic of topics) {
    const createdTopic = await prisma.topic.create({
      data: topic
    })
    createdTopics.push(createdTopic)
    console.log(`✅ Created topic: ${createdTopic.name}`)
  }

  // Path to CSV files (relative to project root)
  const csvDirectory = path.join(__dirname, '../../resource')
  const csvFiles = [
    'Business_Management_and_Administration_Sample_Exam_questions_with_rationales_FIXED.csv',
    'Marketing_Sample_Exam_questions_with_rationales_FIXED.csv',
    'Finance_Sample_Exam_questions_with_rationales_FIXED.csv',
    'Entrepreneurship_Sample_Exam_questions_with_rationales_FIXED.csv',
    'Hospitality_and_Tourism_Sample_Exam_questions_with_rationales_FIXED.csv'
  ]

  let totalQuestions = 0

  // Process each CSV file
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
      const topic = createdTopics.find(t => t.name === topicName)

      if (!topic) {
        console.error(`❌ Topic not found for file: ${csvFile}`)
        continue
      }

      // Process each question from the CSV
      for (const csvQuestion of questions) {
        // Skip if essential data is missing
        if (!csvQuestion.question_text || !csvQuestion.correct_letter) {
          console.warn(`⚠️  Skipping incomplete question: ${csvQuestion.question_number}`)
          continue
        }

        const difficulty = estimateDifficulty(csvQuestion.question_text, csvQuestion.rationale || '')

        await prisma.question.create({
          data: {
            refId: parseInt(csvQuestion.test_number) || totalQuestions + 1,
            questionText: csvQuestion.question_text.trim(),
            optionA: csvQuestion.option_A?.trim() || '',
            optionB: csvQuestion.option_B?.trim() || '',
            optionC: csvQuestion.option_C?.trim() || '',
            optionD: csvQuestion.option_D?.trim() || '',
            correctAnswer: csvQuestion.correct_letter.trim().toUpperCase(),
            explanation: csvQuestion.rationale?.trim() || 'No explanation provided.',
            difficulty: difficulty,
            topicId: topic.id
          }
        })
        totalQuestions++
      }

      console.log(`✅ Added ${questions.length} questions for ${topicName}`)

    } catch (error) {
      console.error(`❌ Error processing ${csvFile}:`, error)
    }
  }

  console.log(`\n🎉 Database seeded successfully!`)
  console.log(`📊 Summary:`)
  console.log(`   - ${createdTopics.length} topics created`)
  console.log(`   - ${totalQuestions} questions loaded from CSV files`)
  console.log(`   - Questions sourced from actual exam PDFs`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })