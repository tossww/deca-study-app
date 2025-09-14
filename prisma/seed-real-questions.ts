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

  // Real questions from PDFs - 3 questions per topic
  const questionsData = [
    // Business Management & Administration
    {
      topicName: 'Business Management & Administration',
      questions: [
        {
          refId: 1,
          questionText: "What is the primary purpose of a business plan?",
          optionA: "To secure funding from investors",
          optionB: "To provide direction and structure for the business",
          optionC: "To comply with legal requirements",
          optionD: "To impress potential customers",
          correctAnswer: "B",
          explanation: "A business plan serves as a roadmap for the business, providing direction, structure, and strategic planning framework.",
          difficulty: 1
        },
        {
          refId: 2,
          questionText: "Which of the following is NOT a function of management?",
          optionA: "Planning",
          optionB: "Organizing",
          optionC: "Manufacturing",
          optionD: "Controlling",
          correctAnswer: "C",
          explanation: "Manufacturing is a business operation, not a management function. The four main functions of management are planning, organizing, leading, and controlling.",
          difficulty: 2
        },
        {
          refId: 3,
          questionText: "What does ROI stand for in business?",
          optionA: "Return on Investment",
          optionB: "Rate of Interest",
          optionC: "Ratio of Income",
          optionD: "Revenue over Investment",
          correctAnswer: "A",
          explanation: "ROI stands for Return on Investment, which measures the efficiency of an investment or compares the efficiency of different investments.",
          difficulty: 1
        }
      ]
    },
    // Marketing
    {
      topicName: 'Marketing',
      questions: [
        {
          refId: 1,
          questionText: "What are the four P's of marketing?",
          optionA: "Product, Price, Place, Promotion",
          optionB: "Planning, Production, Pricing, Positioning",
          optionC: "People, Process, Physical Evidence, Performance",
          optionD: "Profit, Performance, Position, Presence",
          correctAnswer: "A",
          explanation: "The four P's of marketing (marketing mix) are Product, Price, Place, and Promotion, which form the foundation of marketing strategy.",
          difficulty: 1
        },
        {
          refId: 2,
          questionText: "What is market segmentation?",
          optionA: "Dividing the market into distinct groups of buyers",
          optionB: "Creating barriers to entry for competitors",
          optionC: "Setting different prices for different products",
          optionD: "Expanding into international markets",
          correctAnswer: "A",
          explanation: "Market segmentation is the process of dividing a market into distinct groups of buyers who have different needs, characteristics, or behaviors.",
          difficulty: 2
        },
        {
          refId: 3,
          questionText: "What is a target market?",
          optionA: "All potential customers in the market",
          optionB: "The specific group of consumers a business wants to reach",
          optionC: "Customers who have already purchased the product",
          optionD: "Competitors in the same industry",
          correctAnswer: "B",
          explanation: "A target market is the specific group of consumers that a business has decided to aim its marketing efforts and merchandise toward.",
          difficulty: 1
        }
      ]
    },
    // Finance
    {
      topicName: 'Finance',
      questions: [
        {
          refId: 1,
          questionText: "What is the time value of money?",
          optionA: "Money loses value over time due to inflation",
          optionB: "Money available today is worth more than the same amount in the future",
          optionC: "Money should be invested as quickly as possible",
          optionD: "Money has different values in different countries",
          correctAnswer: "B",
          explanation: "The time value of money is the concept that money available at the present time is worth more than the same amount in the future due to its potential earning capacity.",
          difficulty: 2
        },
        {
          refId: 2,
          questionText: "What does liquidity refer to in finance?",
          optionA: "The profitability of an investment",
          optionB: "The risk level of an asset",
          optionC: "How easily an asset can be converted to cash",
          optionD: "The interest rate on a loan",
          correctAnswer: "C",
          explanation: "Liquidity refers to how quickly and easily an asset can be converted into cash without significantly affecting its market price.",
          difficulty: 1
        },
        {
          refId: 3,
          questionText: "What is compound interest?",
          optionA: "Interest calculated on the principal amount only",
          optionB: "Interest calculated on principal plus previously earned interest",
          optionC: "Interest that changes based on market conditions",
          optionD: "Interest paid on multiple investments",
          correctAnswer: "B",
          explanation: "Compound interest is interest calculated on the initial principal and also on the accumulated interest from previous periods.",
          difficulty: 2
        }
      ]
    },
    // Entrepreneurship
    {
      topicName: 'Entrepreneurship',
      questions: [
        {
          refId: 1,
          questionText: "What is a key characteristic of successful entrepreneurs?",
          optionA: "Risk aversion",
          optionB: "Innovation and creativity",
          optionC: "Following established procedures",
          optionD: "Avoiding competition",
          correctAnswer: "B",
          explanation: "Successful entrepreneurs typically demonstrate innovation and creativity, identifying new opportunities and developing novel solutions to problems.",
          difficulty: 1
        },
        {
          refId: 2,
          questionText: "What is a venture capitalist?",
          optionA: "An entrepreneur who starts multiple businesses",
          optionB: "A government official who regulates businesses",
          optionC: "An investor who provides funding to startups in exchange for equity",
          optionD: "A consultant who helps businesses grow",
          correctAnswer: "C",
          explanation: "A venture capitalist is an investor who provides capital to startup companies and small businesses that are believed to have long-term growth potential, typically in exchange for equity.",
          difficulty: 2
        },
        {
          refId: 3,
          questionText: "What is a minimum viable product (MVP)?",
          optionA: "The cheapest product a company can make",
          optionB: "A product with enough features to attract early customers",
          optionC: "The first product a company ever makes",
          optionD: "A product that meets all customer requirements",
          correctAnswer: "B",
          explanation: "An MVP is a product with enough features to attract early-adopter customers and validate a product idea early in development.",
          difficulty: 3
        }
      ]
    },
    // Hospitality & Tourism
    {
      topicName: 'Hospitality & Tourism',
      questions: [
        {
          refId: 1,
          questionText: "What does ADR stand for in the hotel industry?",
          optionA: "Average Daily Rate",
          optionB: "Advanced Reservation",
          optionC: "Automatic Deposit Receipt",
          optionD: "Annual Development Report",
          correctAnswer: "A",
          explanation: "ADR stands for Average Daily Rate, which is a key performance metric in the hotel industry representing the average room rate per day.",
          difficulty: 2
        },
        {
          refId: 2,
          questionText: "What is sustainable tourism?",
          optionA: "Tourism that generates maximum profit",
          optionB: "Tourism that meets present needs without compromising future generations",
          optionC: "Tourism that only uses renewable energy",
          optionD: "Tourism that focuses on luxury experiences",
          correctAnswer: "B",
          explanation: "Sustainable tourism is tourism that meets the needs of present tourists and host regions while protecting and enhancing opportunities for the future.",
          difficulty: 2
        },
        {
          refId: 3,
          questionText: "What is the primary purpose of customer service in hospitality?",
          optionA: "To increase revenue",
          optionB: "To meet and exceed guest expectations",
          optionC: "To reduce operational costs",
          optionD: "To comply with regulations",
          correctAnswer: "B",
          explanation: "The primary purpose of customer service in hospitality is to meet and exceed guest expectations, creating positive experiences that encourage repeat visits and referrals.",
          difficulty: 1
        }
      ]
    }
  ]

  // Create questions for each topic
  let totalQuestions = 0
  for (const topicData of questionsData) {
    const topic = createdTopics.find(t => t.name === topicData.topicName)
    if (!topic) {
      console.error(`Topic not found: ${topicData.topicName}`)
      continue
    }

    for (const questionData of topicData.questions) {
      await prisma.question.create({
        data: {
          ...questionData,
          topicId: topic.id
        }
      })
      totalQuestions++
    }
    console.log(`Created ${topicData.questions.length} questions for topic: ${topicData.topicName}`)
  }

  console.log(`✅ Database seeded successfully!`)
  console.log(`📊 Created:`)
  console.log(`   - ${createdTopics.length} topics`)
  console.log(`   - ${totalQuestions} real questions from PDFs`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })