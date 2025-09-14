import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sampleQuestions = [
  {
    topicName: 'Business Management & Administration',
    questions: [
      {
        questionText: "What is the primary purpose of strategic planning in business management?",
        optionA: "To increase daily operational efficiency",
        optionB: "To set long-term goals and determine resource allocation",
        optionC: "To manage employee schedules", 
        optionD: "To track inventory levels",
        correctAnswer: "1",
        explanation: "Strategic planning focuses on setting long-term organizational goals and determining how to allocate resources to achieve them effectively."
      },
      {
        questionText: "Which leadership style involves making decisions without input from team members?",
        optionA: "Democratic leadership",
        optionB: "Laissez-faire leadership",
        optionC: "Autocratic leadership",
        optionD: "Transformational leadership",
        correctAnswer: "2",
        explanation: "Autocratic leadership is characterized by individual control over all decisions with little input from group members."
      }
    ]
  },
  {
    topicName: 'Entrepreneurship',
    questions: [
      {
        questionText: "What is the most important factor when conducting a feasibility study for a new business?",
        optionA: "Market demand analysis",
        optionB: "Office location selection",
        optionC: "Logo design",
        optionD: "Social media strategy",
        correctAnswer: "0",
        explanation: "Market demand analysis is crucial to determine if there's sufficient customer need for your product or service."
      }
    ]
  },
  {
    topicName: 'Finance',
    questions: [
      {
        questionText: "What does ROI stand for in financial analysis?",
        optionA: "Rate of Interest",
        optionB: "Return on Investment",
        optionC: "Risk of Investment",
        optionD: "Revenue over Income",
        correctAnswer: "1",
        explanation: "ROI stands for Return on Investment, a performance measure used to evaluate the efficiency of an investment."
      }
    ]
  },
  {
    topicName: 'Hospitality & Tourism',
    questions: [
      {
        questionText: "What is the primary goal of revenue management in the hospitality industry?",
        optionA: "Reducing operational costs",
        optionB: "Maximizing room occupancy rates",
        optionC: "Optimizing pricing to maximize revenue",
        optionD: "Improving customer service quality",
        correctAnswer: "2",
        explanation: "Revenue management focuses on optimizing pricing strategies to maximize total revenue, not just occupancy."
      }
    ]
  },
  {
    topicName: 'Marketing',
    questions: [
      {
        questionText: "Which of the following is NOT part of the traditional marketing mix (4 Ps)?",
        optionA: "Product",
        optionB: "Price",
        optionC: "Promotion", 
        optionD: "Positioning",
        correctAnswer: "3",
        explanation: "The traditional 4 Ps are Product, Price, Place, and Promotion. Positioning is a separate marketing concept."
      }
    ]
  }
]

async function main() {
  console.log('Seeding database...')
  
  for (const topicData of sampleQuestions) {
    const topic = await prisma.topic.upsert({
      where: { name: topicData.topicName },
      update: {},
      create: {
        name: topicData.topicName,
        description: `Sample questions for ${topicData.topicName}`,
      },
    })
    
    for (const questionData of topicData.questions) {
      await prisma.question.upsert({
        where: { 
          id: `${topic.id}-${questionData.questionText.slice(0, 20)}`
        },
        update: {},
        create: {
          id: `${topic.id}-${questionData.questionText.slice(0, 20)}`,
          topicId: topic.id,
          ...questionData,
        },
      })
    }
  }
  
  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })