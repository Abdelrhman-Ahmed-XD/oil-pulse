// src/data/articles.js
export const defaultArticles = [
    {
        id: 1,
        category: "OPEC+",
        title: "OPEC+ extends production cuts until the end of Q3 2026",
        excerpt: "OPEC+ countries decided to maintain the voluntary production cut of 2.2 million barrels per day amid global market volatility.",
        author: "News Desk",
        date: "March 20, 2026",
        image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80",
        featured: true,
        body: `OPEC+ announced the extension of the voluntary production cut for an additional six months, a step aimed at stabilizing oil prices amid declining global demand.\n\nThe decision came after a closed meeting of energy ministers of member countries, and the ministers affirmed that the market still needs supply-side support to ensure stable prices.\n\nSaudi Energy Minister said the Kingdom will continue its leading role in maintaining the balance of the global oil market.`,
    },
    {
        id: 2,
        category: "Renewable Energy",
        title: "Solar power surpasses coal for the first time in European history",
        excerpt: "Solar power set a new record in Europe, surpassing coal for the first time in February.",
        author: "Energy Editor",
        date: "March 19, 2026",
        image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
        featured: false,
        body: `In a historic achievement, solar power has surpassed coal in the European electricity mix for the first time in history, according to International Energy Agency data.\n\nThis milestone represents a turning point in Europe's energy transition, as reliance on renewable energy has been increasing significantly in recent years.`,
    },
    {
        id: 3,
        category: "Crude Oil",
        title: "Iraq increases refining capacity with opening of Al-Faw Grand Refinery",
        excerpt: "Iraq opened the Al-Faw refinery with a capacity of 300,000 barrels per day to reduce dependence on imported fuel.",
        author: "Baghdad Correspondent",
        date: "March 18, 2026",
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&q=80",
        featured: false,
        body: `Iraq announced the official opening of the Al-Faw Grand Refinery in the south of the country, which is one of the largest refining projects in the Middle East.\n\nThe refinery will produce 300,000 barrels per day of refined petroleum products, which will significantly reduce Iraq's dependence on fuel imports and save billions of dollars annually.`,
    },
    {
        id: 4,
        category: "Natural Gas",
        title: "Natural gas prices decline 8% due to abundant US supplies",
        excerpt: "Natural gas prices fell in global markets by nearly 8% this week.",
        author: "Market Analyst",
        date: "March 17, 2026",
        image: "https://images.unsplash.com/photo-1545259742-a5f4c04c16c7?w=800&q=80",
        featured: false,
        body: `Natural gas prices fell in global markets by nearly 8% this week, following data indicating that US inventories have risen to levels exceeding analyst expectations.\n\nAnalysts believe that abundant supplies coupled with declining winter demand in Europe are putting double pressure on prices in the coming period.`,
    },
    {
        id: 5,
        category: "Renewable Energy",
        title: "Saudi Arabia invests $50 billion in hydrogen energy projects",
        excerpt: "Saudi Aramco announced a huge investment package in green and blue hydrogen technologies.",
        author: "Riyadh Correspondent",
        date: "March 16, 2026",
        image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80",
        featured: false,
        body: `Saudi Aramco revealed an ambitious investment plan worth $50 billion in the hydrogen sector over the next decade, as part of the Kingdom's strategy to diversify the energy sector.\n\nThe investment package includes projects to produce green hydrogen using solar and wind energy, as well as blue hydrogen projects associated with carbon capture technologies.`,
    },
    {
        id: 6,
        category: "Markets",
        title: "Brent exceeds $85 for the first time in three months",
        excerpt: "Brent crude rose above $85 per barrel driven by declining US inventories and Middle East tensions.",
        author: "Markets Editor",
        date: "March 15, 2026",
        image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
        featured: false,
        body: `Brent crude rose above $85 per barrel for the first time in three months, driven by multiple factors including declining US inventories and rising geopolitical tensions in the Middle East.\n\nAnalysts indicated that the market is highly sensitive to any developments in the region, making prices subject to sharp fluctuations in the near term.`,
    },
]

export function getArticles() {
    const stored = localStorage.getItem("oilpulse_articles")
    if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.length > 0) return parsed
    }
    // Seed localStorage with defaults on first load
    localStorage.setItem("oilpulse_articles", JSON.stringify(defaultArticles))
    return defaultArticles
}

// Helper function to migrate old Arabic category names to English
export function migrateArticlesToEnglish() {
    const articles = JSON.parse(localStorage.getItem("oilpulse_articles") || "[]")
    if (articles.length === 0) return

    const categoryMap = {
        "أوبك+": "OPEC+",
        "البترول": "Petroleum",
        "نفط خام": "Crude Oil",
        "الغاز الطبيعي": "Natural Gas",
        "غاز طبيعي": "Natural Gas",
        "الطاقة المتجددة": "Renewable Energy",
        "طاقة متجددة": "Renewable Energy",
        "الأسواق": "Markets",
        "أسواق": "Markets",
        "تقارير": "Reports",
    }

    let migrated = false
    const updated = articles.map(article => {
        const newCategory = categoryMap[article.category]
        if (newCategory && newCategory !== article.category) {
            migrated = true
            return { ...article, category: newCategory }
        }
        return article
    })

    if (migrated) {
        localStorage.setItem("oilpulse_articles", JSON.stringify(updated))
        console.log("Articles migrated to English category names")
    }
}