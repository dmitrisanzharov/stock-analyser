export type ScoreArrayItem = {
    criteriaId: string;
    dmitriScore: number;
}

export type Company = {
    dateOfAnalysis: string,
    name: string,
    isin: string,
    score: number,
    country: string
}

export type InvestmentRecord = {
    purchased: number;
    "Company Name": string;
    isin: string;
    Country: string;
    notes: string | null;
    "units bough": number | null;
    "price paid in Eur": number | null;
    "added to dividends calendar": string | null;
    "Purchased at least 1 euro": string | null;
    "current Allocation in Eur": number | null;
    "expected annual yield in eur": number | null;
    "Yield as % (pref, degiro, 5 years)": number | null;
    "time to double you money on dividends alone": number | null;
    "Number of payments per Year": string | number | null;
    "month of EX-date on Investing.com": string | null;
    ".": string | null;

    "date of analysis": string | null;
    "degiro grade | dmitri translation": string;
    "country corruption index (100 max)": number | null;

    Industry: string | null;

    "PE ratio": number | null;
    "industry PE": number | null;
    "company to industry": number | null;

    "Net Profit Margin AVG 5 years": number | null;
    "Net Profit Margin AVG 5 years (industry)": number | null;
    "company to industry margin": number | null;

    "Return On Equity 5ya": number | null;
    "Return On Equity 5ya (industry)": number | null;

    "5 Year EPS Growth": number | null;
    "5 Year EPS Growth (industry)": number | null;

    "5 Year Sales Growth": number | null;
    "5 Year Sales Growth (industry)": number | null;

    "Net Income/Employee": number | null;
    "Net Income/Employee (industry)": number | null;

    ytd: number | null;
    "5 yrs": number | null;
    all: number | null;
    "stock chart score": number;

    "who is the Auditor?": string | number | null;
    "Auditor Score": number | null;
    "fitch rating or equivalent": number | null | string;
    "fitch outlook": string | null;
    moody: number | null | string;
    "moody outlook": string | null;
    "s&p": number | null | string;
    "s&p outlook": string | null;

    "how does their Income Statement Look on Degiro": number | string | null;
    "are assets bigger than liabilities consistently": number | string | null;
    "year started": number | null;
    "number of employees": number | null;
    "any dirt on them (0 being clean, 10 dirty)": number | null;
    "Held By Big Investors": number | string | null;

    "Share Price in euro": number | null;
    "avg trading volume, last 3 months in units in Millions": number | null;
    "avg trading volume in euro in last 3 months in euro in millions": number | null;
    "EPS (earning per share) average for the past 10 years in euro currency": number | null;
    "years to Earnings Match share": number | null;
    "book value per share on average past 10 years in euro currency": number | null;
    "share / book value": number | null;
    "equity average past 10 years in millions euro": number | null;
    "EBITDA average for the past 10 years in euros in millions?": number | null;
    "annual net profit average in the past 10 years, in euros in millions?": number | null;

    "P/E ratio": number | null;
    "Price / book": number | null;
    "debt / equity as %": number | null;
    "return on equity": number | null;
    "market cap in Billions EUR (ask AI) (i.e. hype value... total shares X current share value)": number | null;

    "is company part of any index / index fund (e.g. MSCI world fund), grade as: 0 = No indexes hold it (worst), 1 = some indexes hold it, 2 = many indexes hold it, 3 = almost ALL hold it (the best)": number | null;
    "is held by Billionaires? ( use percentage of total portfolios, MAX 1)": number | null;

    "valuation, max 6": number | null;
    "future growth, 6 max": number | null;
    "past performance, 6 mx": number | null;
    "financial health, max 6": number | null;
    "dividends, max 6": number | null;
    "management, 4 max": number | null;

    // AI analysis stuff
    "degiro (A = 11; B=8; C=4; D=1)": string | number | null;
    "Dmitri score by feel": number | string;
    "fitch rating": number | null;
    "moody rating": number | null;
    "s&p rating": number | null;

    "avg AI grade": number | null;
    "chatGPT Grade (11 to 1)": number | null;
    "ChatGPT Plus": number | null;
    claude: number | null;
    gemini: number | null;
    copilot: number | null;
    perplexity: number | null;
    LeChat: number | null;
    grok: number | null;
    kimi: number | null;
    deepseek: number | null;
};

export type RatingType = string | number | null;