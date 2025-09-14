import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create topics first
  const topics = [
    { name: 'Business Management & Administration', description: 'Core business principles and management concepts' },
    { name: 'Marketing', description: 'Marketing strategies, consumer behavior, and brand management' },
    { name: 'Finance', description: 'Financial planning, investments, and economic principles' },
    { name: 'Entrepreneurship', description: 'Starting and running a business, innovation and risk management' },
    { name: 'Hospitality & Tourism', description: 'Travel, tourism industry, and hospitality management' }
  ]

  const createdTopics = []
  for (const topic of topics) {
    const createdTopic = await prisma.topic.create({
      data: topic
    })
    createdTopics.push(createdTopic)
    console.log(`Created topic: ${createdTopic.name}`)
  }

  // Sample questions with refId 1-100 for each topic
  const sampleQuestions = []

  for (let refId = 1; refId <= 100; refId++) {
    sampleQuestions.push({
      refId,
      questionText: `Sample question ${refId} - What is the primary objective of business management?`,
      optionA: "To maximize profits",
      optionB: "To satisfy customers",
      optionC: "To manage resources efficiently",
      optionD: "All of the above",
      correctAnswer: "D",
      explanation: `This is a sample explanation for question ${refId}. The correct answer demonstrates understanding of comprehensive business objectives.`,
      difficulty: ((refId - 1) % 3) + 1 // Cycles through 1, 2, 3 for Easy, Medium, Hard
    })
  }

  // Create questions for each topic
  let totalQuestions = 0
  for (const topic of createdTopics) {
    for (const questionData of sampleQuestions) {
      await prisma.question.create({
        data: {
          ...questionData,
          topicId: topic.id,
          questionText: questionData.questionText.replace('business management', topic.name.toLowerCase())
        }
      })
      totalQuestions++
    }
    console.log(`Created 100 questions for topic: ${topic.name}`)
  }

  console.log(`✅ Database seeded successfully!`)
  console.log(`📊 Created:`)
  console.log(`   - ${createdTopics.length} topics`)
  console.log(`   - ${totalQuestions} questions (with refId 1-100 per topic)`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })