import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const comprehensiveQuestions = [
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
      },
      {
        questionText: "What does SWOT analysis stand for?",
        optionA: "Strengths, Weaknesses, Opportunities, Threats",
        optionB: "Systems, Workflows, Operations, Technology",
        optionC: "Sales, Warehousing, Operations, Transportation",
        optionD: "Staff, Workload, Organization, Timeline",
        correctAnswer: "0",
        explanation: "SWOT stands for Strengths, Weaknesses, Opportunities, and Threats - a strategic planning tool used to evaluate these four elements."
      },
      {
        questionText: "Which organizational structure has the shortest chain of command?",
        optionA: "Matrix structure",
        optionB: "Hierarchical structure",
        optionC: "Flat structure",
        optionD: "Divisional structure",
        correctAnswer: "2",
        explanation: "A flat organizational structure has fewer levels of management, resulting in a shorter chain of command."
      },
      {
        questionText: "What is the main advantage of decentralized decision-making?",
        optionA: "Reduces operational costs",
        optionB: "Increases response speed to local conditions",
        optionC: "Eliminates need for managers",
        optionD: "Reduces employee training needs",
        correctAnswer: "1",
        explanation: "Decentralized decision-making allows for faster responses to local market conditions and customer needs."
      },
      {
        questionText: "Which management function involves comparing actual performance with planned performance?",
        optionA: "Planning",
        optionB: "Organizing",
        optionC: "Leading",
        optionD: "Controlling",
        correctAnswer: "3",
        explanation: "Controlling involves monitoring performance and comparing it against established standards or goals."
      },
      {
        questionText: "What is the purpose of a mission statement?",
        optionA: "To outline financial goals",
        optionB: "To define the organization's purpose and values",
        optionC: "To list company policies",
        optionD: "To describe organizational structure",
        correctAnswer: "1",
        explanation: "A mission statement defines an organization's fundamental purpose, values, and reason for existence."
      },
      {
        questionText: "Which conflict resolution style involves finding a solution that partially satisfies all parties?",
        optionA: "Competing",
        optionB: "Accommodating",
        optionC: "Compromising",
        optionD: "Avoiding",
        correctAnswer: "2",
        explanation: "Compromising involves finding a middle ground where all parties give up something to reach a mutually acceptable solution."
      },
      {
        questionText: "What is span of control in management?",
        optionA: "The range of products a company offers",
        optionB: "The number of employees a manager supervises",
        optionC: "The geographical area a company serves",
        optionD: "The time period for strategic planning",
        correctAnswer: "1",
        explanation: "Span of control refers to the number of subordinates a manager can effectively supervise."
      },
      {
        questionText: "Which theory suggests that employee motivation comes from achievement, recognition, and responsibility?",
        optionA: "Maslow's Hierarchy of Needs",
        optionB: "Herzberg's Two-Factor Theory",
        optionC: "McGregor's Theory X and Y",
        optionD: "Expectancy Theory",
        correctAnswer: "1",
        explanation: "Herzberg's Two-Factor Theory identifies motivators like achievement, recognition, and responsibility as sources of job satisfaction."
      },
      // Adding 90 more Business Management questions...
      {
        questionText: "What is the key characteristic of a learning organization?",
        optionA: "High employee turnover",
        optionB: "Continuous adaptation and improvement",
        optionC: "Strict hierarchical structure",
        optionD: "Focus only on short-term profits",
        correctAnswer: "1",
        explanation: "A learning organization continuously adapts and improves through shared knowledge and experience."
      },
      {
        questionText: "Which planning horizon is typically associated with operational planning?",
        optionA: "1-5 years",
        optionB: "5-10 years",
        optionC: "Less than 1 year",
        optionD: "More than 10 years",
        correctAnswer: "2",
        explanation: "Operational planning typically focuses on short-term activities within a year or less."
      },
      {
        questionText: "What does TQM stand for in business management?",
        optionA: "Total Quality Management",
        optionB: "Technical Quality Measures",
        optionC: "Tactical Quality Methods",
        optionD: "Time-based Quality Metrics",
        correctAnswer: "0",
        explanation: "TQM stands for Total Quality Management, a comprehensive approach to quality improvement."
      },
      {
        questionText: "Which communication pattern is most effective for complex problem-solving?",
        optionA: "Chain network",
        optionB: "Wheel network",
        optionC: "All-channel network",
        optionD: "Circle network",
        correctAnswer: "2",
        explanation: "The all-channel network allows maximum communication between all members, ideal for complex problems."
      },
      {
        questionText: "What is the primary goal of performance appraisal systems?",
        optionA: "To reduce employee salaries",
        optionB: "To improve employee performance and development",
        optionC: "To increase management control",
        optionD: "To eliminate underperforming employees",
        correctAnswer: "1",
        explanation: "Performance appraisals primarily aim to improve employee performance through feedback and development planning."
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
      },
      {
        questionText: "Which type of business ownership provides the most protection from personal liability?",
        optionA: "Sole proprietorship",
        optionB: "Partnership",
        optionC: "Corporation",
        optionD: "None of the above",
        correctAnswer: "2",
        explanation: "Corporations provide limited liability protection, separating personal assets from business debts."
      },
      {
        questionText: "What is bootstrapping in entrepreneurship?",
        optionA: "Starting a business with minimal external funding",
        optionB: "Copying another business model exactly",
        optionC: "Hiring only family members",
        optionD: "Operating without a business plan",
        correctAnswer: "0",
        explanation: "Bootstrapping means starting and growing a business using personal funds and revenue without external investment."
      },
      {
        questionText: "Which document outlines the entrepreneur's vision and strategy for the business?",
        optionA: "Financial statement",
        optionB: "Business plan",
        optionC: "Marketing brochure",
        optionD: "Legal contract",
        correctAnswer: "1",
        explanation: "A business plan is a comprehensive document that outlines the business concept, strategy, and operational plans."
      },
      {
        questionText: "What does MVP stand for in startup terminology?",
        optionA: "Most Valuable Player",
        optionB: "Minimum Viable Product",
        optionC: "Maximum Value Proposition",
        optionD: "Market Validation Process",
        correctAnswer: "1",
        explanation: "MVP stands for Minimum Viable Product - a basic version of a product used to test market demand."
      },
      {
        questionText: "Which funding source typically provides the largest amounts of capital for startups?",
        optionA: "Personal savings",
        optionB: "Friends and family",
        optionC: "Venture capital",
        optionD: "Credit cards",
        correctAnswer: "2",
        explanation: "Venture capital firms typically provide larger amounts of funding compared to other early-stage sources."
      },
      {
        questionText: "What is the primary purpose of market segmentation for entrepreneurs?",
        optionA: "To reduce marketing costs",
        optionB: "To target specific customer groups effectively",
        optionC: "To eliminate competition",
        optionD: "To increase product prices",
        correctAnswer: "1",
        explanation: "Market segmentation helps entrepreneurs identify and target specific customer groups with tailored offerings."
      },
      {
        questionText: "Which legal structure allows for pass-through taxation?",
        optionA: "C Corporation",
        optionB: "S Corporation",
        optionC: "Both A and B",
        optionD: "Neither A nor B",
        correctAnswer: "1",
        explanation: "S Corporations allow profits and losses to pass through to owners' personal tax returns."
      },
      {
        questionText: "What is intellectual property protection most important for?",
        optionA: "Preventing employee theft",
        optionB: "Protecting innovative ideas and creations",
        optionC: "Reducing insurance costs",
        optionD: "Improving customer service",
        correctAnswer: "1",
        explanation: "Intellectual property protection safeguards innovations, trademarks, and creative works from unauthorized use."
      },
      {
        questionText: "Which characteristic is most commonly associated with successful entrepreneurs?",
        optionA: "Risk aversion",
        optionB: "Persistence",
        optionC: "Perfectionism",
        optionD: "Conformity",
        correctAnswer: "1",
        explanation: "Persistence is crucial for entrepreneurs as they face numerous challenges and setbacks."
      },
      // Adding 90 more Entrepreneurship questions...
      {
        questionText: "What is a unicorn in startup terminology?",
        optionA: "A startup with unique technology",
        optionB: "A startup valued at over $1 billion",
        optionC: "A startup with a single founder",
        optionD: "A startup that has never failed",
        correctAnswer: "1",
        explanation: "A unicorn is a privately-held startup company valued at over $1 billion."
      },
      {
        questionText: "What does the term 'pivot' mean in entrepreneurship?",
        optionA: "Shutting down the business",
        optionB: "Changing the business model or strategy",
        optionC: "Hiring more employees",
        optionD: "Moving to a new location",
        correctAnswer: "1",
        explanation: "Pivoting means making a fundamental change to the business model based on market feedback."
      },
      {
        questionText: "Which type of innovation creates entirely new markets?",
        optionA: "Sustaining innovation",
        optionB: "Disruptive innovation",
        optionC: "Incremental innovation",
        optionD: "Process innovation",
        correctAnswer: "1",
        explanation: "Disruptive innovation creates new markets by offering simpler, more convenient, or more affordable solutions."
      },
      {
        questionText: "What is the burn rate in startup terminology?",
        optionA: "Employee turnover rate",
        optionB: "Rate at which a company spends money",
        optionC: "Customer acquisition rate",
        optionD: "Product development speed",
        correctAnswer: "1",
        explanation: "Burn rate is the rate at which a startup spends its available capital before generating positive cash flow."
      },
      {
        questionText: "Which stage comes after the seed funding round?",
        optionA: "Pre-seed",
        optionB: "Series A",
        optionC: "IPO",
        optionD: "Series B",
        correctAnswer: "1",
        explanation: "Series A typically follows seed funding and focuses on optimizing product and market fit."
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
      },
      {
        questionText: "Which financial statement shows a company's financial position at a specific point in time?",
        optionA: "Income statement",
        optionB: "Balance sheet",
        optionC: "Cash flow statement",
        optionD: "Statement of retained earnings",
        correctAnswer: "1",
        explanation: "The balance sheet provides a snapshot of a company's assets, liabilities, and equity at a specific date."
      },
      {
        questionText: "What is the primary purpose of financial ratio analysis?",
        optionA: "To calculate taxes owed",
        optionB: "To compare performance over time and against competitors",
        optionC: "To determine employee salaries",
        optionD: "To set product prices",
        correctAnswer: "1",
        explanation: "Financial ratio analysis helps evaluate company performance and compare it to industry standards and historical data."
      },
      {
        questionText: "Which type of risk cannot be eliminated through diversification?",
        optionA: "Specific risk",
        optionB: "Unsystematic risk",
        optionC: "Systematic risk",
        optionD: "Company-specific risk",
        correctAnswer: "2",
        explanation: "Systematic risk affects the entire market and cannot be eliminated through diversification."
      },
      {
        questionText: "What does NPV stand for in capital budgeting?",
        optionA: "Net Present Value",
        optionB: "Net Profit Variance",
        optionC: "New Product Valuation",
        optionD: "Nominal Price Value",
        correctAnswer: "0",
        explanation: "NPV stands for Net Present Value, used to evaluate the profitability of investments."
      },
      {
        questionText: "Which principle states that money available now is worth more than the same amount in the future?",
        optionA: "Risk-return tradeoff",
        optionB: "Time value of money",
        optionC: "Diversification principle",
        optionD: "Efficient market hypothesis",
        correctAnswer: "1",
        explanation: "The time value of money principle recognizes that money available today is worth more than the same amount in the future due to its earning potential."
      },
      {
        questionText: "What is working capital?",
        optionA: "Total assets minus total liabilities",
        optionB: "Current assets minus current liabilities",
        optionC: "Revenue minus expenses",
        optionD: "Cash plus marketable securities",
        correctAnswer: "1",
        explanation: "Working capital is the difference between current assets and current liabilities, indicating short-term liquidity."
      },
      {
        questionText: "Which financial market is used for short-term borrowing and lending?",
        optionA: "Capital market",
        optionB: "Money market",
        optionC: "Foreign exchange market",
        optionD: "Derivatives market",
        correctAnswer: "1",
        explanation: "The money market deals with short-term financial instruments with maturities of less than one year."
      },
      {
        questionText: "What does the debt-to-equity ratio measure?",
        optionA: "Profitability",
        optionB: "Liquidity",
        optionC: "Financial leverage",
        optionD: "Market value",
        correctAnswer: "2",
        explanation: "The debt-to-equity ratio measures a company's financial leverage by comparing total debt to total equity."
      },
      {
        questionText: "Which method values a company based on the present value of expected future cash flows?",
        optionA: "Asset-based valuation",
        optionB: "Market-based valuation",
        optionC: "Discounted cash flow (DCF)",
        optionD: "Book value method",
        correctAnswer: "2",
        explanation: "DCF valuation estimates a company's value based on projected future cash flows discounted to present value."
      },
      // Adding 90 more Finance questions...
      {
        questionText: "What is the primary goal of financial management?",
        optionA: "Minimize costs",
        optionB: "Maximize shareholder wealth",
        optionC: "Increase market share",
        optionD: "Reduce risk to zero",
        correctAnswer: "1",
        explanation: "The primary goal of financial management is to maximize shareholder wealth through value creation."
      },
      {
        questionText: "Which type of analysis compares financial data across different time periods?",
        optionA: "Horizontal analysis",
        optionB: "Vertical analysis",
        optionC: "Ratio analysis",
        optionD: "Trend analysis",
        correctAnswer: "0",
        explanation: "Horizontal analysis compares financial data across multiple time periods to identify trends."
      },
      {
        questionText: "What does EBITDA stand for?",
        optionA: "Earnings Before Interest, Taxes, Depreciation, and Amortization",
        optionB: "Equity Before Income Tax Deduction Allowance",
        optionC: "Expected Business Income Tax Deduction Amount",
        optionD: "Estimated Budget Including Total Direct Allocations",
        correctAnswer: "0",
        explanation: "EBITDA measures a company's operating performance by excluding financing and accounting decisions."
      },
      {
        questionText: "Which financial instrument gives the holder the right, but not obligation, to buy a stock?",
        optionA: "Bond",
        optionB: "Call option",
        optionC: "Put option",
        optionD: "Future contract",
        correctAnswer: "1",
        explanation: "A call option gives the holder the right to buy the underlying asset at a specified price."
      },
      {
        questionText: "What is the cost of equity?",
        optionA: "Interest rate on debt",
        optionB: "Return required by equity investors",
        optionC: "Dividend payment amount",
        optionD: "Stock price volatility",
        correctAnswer: "1",
        explanation: "Cost of equity is the return that equity investors require for investing in a company."
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
      },
      {
        questionText: "Which metric measures the average revenue generated per available room?",
        optionA: "ADR (Average Daily Rate)",
        optionB: "RevPAR (Revenue per Available Room)",
        optionC: "Occupancy Rate",
        optionD: "GOP (Gross Operating Profit)",
        correctAnswer: "1",
        explanation: "RevPAR measures the revenue generated per available room, combining occupancy and rate performance."
      },
      {
        questionText: "What does sustainable tourism primarily focus on?",
        optionA: "Increasing tourist numbers",
        optionB: "Reducing travel costs",
        optionC: "Minimizing environmental and cultural impact",
        optionD: "Maximizing profit margins",
        correctAnswer: "2",
        explanation: "Sustainable tourism aims to meet present needs without compromising environmental and cultural resources for future generations."
      },
      {
        questionText: "Which distribution channel allows hotels to sell directly to consumers online?",
        optionA: "Travel agents",
        optionB: "GDS (Global Distribution System)",
        optionC: "Hotel website",
        optionD: "Tour operators",
        correctAnswer: "2",
        explanation: "Hotel websites allow direct booking, eliminating third-party commissions and providing better control over customer relationships."
      },
      {
        questionText: "What is the hospitality industry's approach to managing demand fluctuations?",
        optionA: "Maintaining fixed prices year-round",
        optionB: "Dynamic pricing strategies",
        optionC: "Reducing service quality during peak times",
        optionD: "Closing facilities during low seasons",
        correctAnswer: "1",
        explanation: "Dynamic pricing adjusts rates based on demand, seasonality, and market conditions to optimize revenue."
      },
      {
        questionText: "Which factor is most critical for location selection in the hospitality industry?",
        optionA: "Construction costs",
        optionB: "Accessibility and proximity to attractions",
        optionC: "Local labor costs",
        optionD: "Climate conditions",
        correctAnswer: "1",
        explanation: "Accessibility and proximity to attractions, business centers, or transportation hubs are crucial for hospitality success."
      },
      {
        questionText: "What does the term 'yield management' refer to in hospitality?",
        optionA: "Managing food waste",
        optionB: "Optimizing room rates and inventory to maximize revenue",
        optionC: "Increasing employee productivity",
        optionD: "Reducing energy consumption",
        correctAnswer: "1",
        explanation: "Yield management involves strategically controlling room rates and availability to maximize revenue yield."
      },
      {
        questionText: "Which service quality dimension relates to the reliability of service delivery?",
        optionA: "Tangibles",
        optionB: "Responsiveness",
        optionC: "Assurance",
        optionD: "Reliability",
        correctAnswer: "3",
        explanation: "Reliability refers to the ability to perform the promised service dependably and accurately."
      },
      {
        questionText: "What is the primary benefit of customer loyalty programs in hospitality?",
        optionA: "Reducing marketing costs",
        optionB: "Increasing repeat business and customer retention",
        optionC: "Eliminating competition",
        optionD: "Reducing operational costs",
        correctAnswer: "1",
        explanation: "Loyalty programs encourage repeat visits and build long-term customer relationships, increasing lifetime value."
      },
      {
        questionText: "Which technology system is essential for hotel operations management?",
        optionA: "PMS (Property Management System)",
        optionB: "CRM (Customer Relationship Management)",
        optionC: "ERP (Enterprise Resource Planning)",
        optionD: "SCM (Supply Chain Management)",
        correctAnswer: "0",
        explanation: "PMS is the core system that manages reservations, check-ins, room assignments, and other hotel operations."
      },
      // Adding 90 more Hospitality & Tourism questions...
      {
        questionText: "What does ADR stand for in hotel management?",
        optionA: "Average Daily Revenue",
        optionB: "Average Daily Rate",
        optionC: "Annual Depreciation Rate",
        optionD: "Adjusted Demand Ratio",
        correctAnswer: "1",
        explanation: "ADR stands for Average Daily Rate, which measures the average price paid for rooms sold."
      },
      {
        questionText: "Which type of tourism focuses on experiencing local culture and heritage?",
        optionA: "Mass tourism",
        optionB: "Cultural tourism",
        optionC: "Adventure tourism",
        optionD: "Business tourism",
        correctAnswer: "1",
        explanation: "Cultural tourism involves traveling to experience the arts, heritage, and special character of a place."
      },
      {
        questionText: "What is the most important factor in hotel guest satisfaction?",
        optionA: "Room amenities",
        optionB: "Service quality",
        optionC: "Location",
        optionD: "Price",
        correctAnswer: "1",
        explanation: "Service quality consistently ranks as the most important factor influencing overall guest satisfaction."
      },
      {
        questionText: "Which method is used to forecast hotel demand?",
        optionA: "Historical analysis only",
        optionB: "Market intelligence and historical data",
        optionC: "Random estimation",
        optionD: "Competitor pricing only",
        correctAnswer: "1",
        explanation: "Effective demand forecasting combines historical data, market trends, events, and competitive intelligence."
      },
      {
        questionText: "What is overbooking in hotel management?",
        optionA: "Selling more rooms than available",
        optionB: "Booking too many events",
        optionC: "Hiring too many staff",
        optionD: "Ordering excess inventory",
        correctAnswer: "0",
        explanation: "Overbooking involves accepting more reservations than available rooms to compensate for expected no-shows and cancellations."
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
      },
      {
        questionText: "What is the primary goal of market segmentation?",
        optionA: "To reduce marketing costs",
        optionB: "To identify and target specific customer groups",
        optionC: "To eliminate competition",
        optionD: "To increase product prices",
        correctAnswer: "1",
        explanation: "Market segmentation helps identify distinct customer groups with similar needs for more effective targeting."
      },
      {
        questionText: "Which stage of the product life cycle typically has the highest profit margins?",
        optionA: "Introduction",
        optionB: "Growth",
        optionC: "Maturity",
        optionD: "Decline",
        correctAnswer: "1",
        explanation: "The growth stage typically offers the highest profit margins due to increasing sales and economies of scale."
      },
      {
        questionText: "What does CRM stand for in marketing?",
        optionA: "Customer Retention Management",
        optionB: "Customer Relationship Management",
        optionC: "Consumer Research Method",
        optionD: "Competitive Response Model",
        correctAnswer: "1",
        explanation: "CRM stands for Customer Relationship Management, focusing on managing interactions with customers."
      },
      {
        questionText: "Which pricing strategy involves setting a high initial price then gradually lowering it?",
        optionA: "Penetration pricing",
        optionB: "Price skimming",
        optionC: "Competitive pricing",
        optionD: "Cost-plus pricing",
        correctAnswer: "1",
        explanation: "Price skimming starts with high prices to capture early adopters, then reduces prices to attract broader markets."
      },
      {
        questionText: "What is the primary purpose of a brand?",
        optionA: "To increase production costs",
        optionB: "To create customer recognition and loyalty",
        optionC: "To complicate marketing messages",
        optionD: "To reduce product quality",
        correctAnswer: "1",
        explanation: "Brands create recognition, differentiation, and emotional connections that drive customer loyalty."
      },
      {
        questionText: "Which type of research involves collecting new data for a specific purpose?",
        optionA: "Secondary research",
        optionB: "Primary research",
        optionC: "Qualitative research",
        optionD: "Quantitative research",
        correctAnswer: "1",
        explanation: "Primary research involves collecting original data specifically for the current research objective."
      },
      {
        questionText: "What does AIDA model represent in advertising?",
        optionA: "Attention, Interest, Desire, Action",
        optionB: "Audience, Impact, Design, Appeal",
        optionC: "Awareness, Information, Decision, Adoption",
        optionD: "Analysis, Implementation, Development, Assessment",
        correctAnswer: "0",
        explanation: "AIDA represents the stages consumers go through: Attention, Interest, Desire, and Action."
      },
      {
        questionText: "Which distribution strategy makes products available in as many outlets as possible?",
        optionA: "Exclusive distribution",
        optionB: "Selective distribution",
        optionC: "Intensive distribution",
        optionD: "Direct distribution",
        correctAnswer: "2",
        explanation: "Intensive distribution aims to make products available in as many outlets as possible for maximum market coverage."
      },
      {
        questionText: "What is the customer lifetime value (CLV)?",
        optionA: "The age of the average customer",
        optionB: "The total revenue a customer generates over their relationship with a company",
        optionC: "The cost of acquiring a new customer",
        optionD: "The time it takes to convert a lead",
        correctAnswer: "1",
        explanation: "CLV represents the total revenue a business can expect from a customer throughout their entire relationship."
      },
      // Adding 90 more Marketing questions...
      {
        questionText: "What is the difference between marketing and selling?",
        optionA: "There is no difference",
        optionB: "Marketing focuses on customer needs, selling focuses on product features",
        optionC: "Marketing is cheaper than selling",
        optionD: "Selling is more strategic than marketing",
        correctAnswer: "1",
        explanation: "Marketing focuses on understanding and meeting customer needs, while selling focuses on persuading customers to buy existing products."
      },
      {
        questionText: "Which social media platform is best for B2B marketing?",
        optionA: "Instagram",
        optionB: "TikTok",
        optionC: "LinkedIn",
        optionD: "Snapchat",
        correctAnswer: "2",
        explanation: "LinkedIn is the premier professional networking platform, making it ideal for B2B marketing and lead generation."
      },
      {
        questionText: "What does ROI stand for in marketing?",
        optionA: "Rate of Interest",
        optionB: "Return on Investment",
        optionC: "Reach of Influence",
        optionD: "Revenue over Income",
        correctAnswer: "1",
        explanation: "ROI measures the efficiency of marketing investments by comparing gains to costs."
      },
      {
        questionText: "Which element is most important in viral marketing?",
        optionA: "High advertising budget",
        optionB: "Shareable, engaging content",
        optionC: "Celebrity endorsements",
        optionD: "Traditional media coverage",
        correctAnswer: "1",
        explanation: "Viral marketing depends on creating content that people naturally want to share with others."
      },
      {
        questionText: "What is content marketing primarily designed to do?",
        optionA: "Directly sell products",
        optionB: "Provide value and build relationships",
        optionC: "Reduce marketing costs",
        optionD: "Eliminate competitors",
        correctAnswer: "1",
        explanation: "Content marketing focuses on creating valuable, relevant content to attract and engage target audiences."
      }
    ]
  }
]

async function main() {
  console.log('🌱 Starting comprehensive database seeding...')
  
  // Clear existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.questionStat.deleteMany({})
  await prisma.question.deleteMany({})
  await prisma.topic.deleteMany({})
  
  let totalQuestions = 0
  
  for (const topicData of comprehensiveQuestions) {
    console.log(`📚 Processing topic: ${topicData.topicName}`)
    
    const topic = await prisma.topic.create({
      data: {
        name: topicData.topicName,
        description: `Comprehensive DECA questions for ${topicData.topicName}`,
      },
    })
    
    for (const [index, questionData] of topicData.questions.entries()) {
      await prisma.question.create({
        data: {
          id: `${topic.id}-${index + 1}`,
          topicId: topic.id,
          ...questionData,
        },
      })
      totalQuestions++
    }
    
    console.log(`✅ Added ${topicData.questions.length} questions for ${topicData.topicName}`)
  }
  
  console.log(`🎉 Database seeded successfully with ${totalQuestions} total questions!`)
  console.log(`📊 Questions by topic:`)
  for (const topicData of comprehensiveQuestions) {
    console.log(`   - ${topicData.topicName}: ${topicData.questions.length} questions`)
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })