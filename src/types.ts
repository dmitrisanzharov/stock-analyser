export type ScoreArrayItem = {
    criteriaId: string;
    dmitriScore: number;
};

export type Company = {
    dateOfAnalysis: string;
    name: string;
    isin: string;
    score: number;
    country: string;
};

export const NA_STRING = 'na';
export const NOT_APPLICABLE_STRING = 'notApplicable';

export type NotApplicableFields = null | typeof NA_STRING | typeof NOT_APPLICABLE_STRING;

export const notApplicableFieldsConst: NotApplicableFields[] = [null, NA_STRING, NOT_APPLICABLE_STRING];

export type RatingsType = number | typeof NOT_APPLICABLE_STRING;
export type RatingsOutlookType = 'positive' | 'stable' | 'negative' | typeof NOT_APPLICABLE_STRING;

export type InvestmentRecord = {
    purchased: number;
    'Company Name': string;
    isin: string;
    Country: string;
    notes: string | null;
    'units bough': number | null;
    'price paid in Eur': number | null;
    'added to dividends calendar': string | null;
    'Purchased at least 1 euro': string | null;
    'current Allocation in Eur': number | null;
    'expected annual yield in eur': number | null;
    'Yield as % (pref, degiro, 5 years)': number | null;
    'time to double you money on dividends alone': number | null;
    'Number of payments per Year': string | number | null;
    'month of EX-date on Investing.com': string | null;
    '.': string | null;

    'date of analysis': string | null;
    'degiro grade | dmitri translation': string;
    'country corruption index (100 max)': number | null;
    'Country science score': number | null;
    'Percentage of Population in Stem in Workforce': number | null;
    'WhiteSmartAsianIndex (max 100)': number | null;
    CompanyMonopolyPowerAndMoat: number | null;

    Industry: string | null;

    // RATIOS
    'PE ratio': number | null | NotApplicableFields;
    'industry PE': number | null;
    'company to industry': number | null;

    'Net Profit Margin AVG 5 years': number | null | NotApplicableFields;
    'Net Profit Margin AVG 5 years (industry)': number | null;
    'company to industry margin': number | null;

    'Return On Equity 5ya': number | null | NotApplicableFields;
    'Return On Equity 5ya (industry)': number | null;

    '5 Year EPS Growth': number | null | NotApplicableFields;
    '5 Year EPS Growth (industry)': number | null;

    '5 Year Sales Growth': number | null | NotApplicableFields;
    '5 Year Sales Growth (industry)': number | null;

    'Net Income/Employee': number | null | NotApplicableFields;
    'Net Income/Employee (industry)': number | null;

    'debt / equity as %': number | null;

    currentRatioCompany: number | null | NotApplicableFields;
    currentRatioIndustry: number | null | NotApplicableFields;

    // 5 Year Performance
    'startDate_16/10/2020': number | NotApplicableFields;
    'endDate_16/10/2025': number | NotApplicableFields;
    'dividendsReceived_till_16/10/2025': number | NotApplicableFields;
    'finalGrowth_till_16/10/2025': number | NotApplicableFields;
    'dividendsAsPercentageOfTotalGrowth_till_16/10/2025': number | NotApplicableFields;

    ytd: number | null;
    '5 yrs': number | null;
    all: number | null;
    'stock chart score': number;

    'who is the Auditor?': string | number | null;
    'Auditor Score': number | null;

    // Credit Ratings
    'fitch rating or equivalent': RatingsType;
    'fitch outlook': RatingsOutlookType;

    moody: RatingsType;
    'moody outlook': RatingsOutlookType;

    's&p': RatingsType;
    's&p outlook': RatingsType;

    'Scope Ratings GmbH': RatingsType;
    'Scope Ratings GmbH Outlook': RatingsOutlookType;



    // -----------------------------------

    'how does their Income Statement Look on Degiro': number | string | null;
    'Degiro Analysts Score': number | null;
    'are assets bigger than liabilities consistently': number | string | null;
    'year started': number | null;
    'number of employees': number | null;
    'any dirt on them (0 being clean, 10 dirty)': number | null;
    'Held By Big Investors': number | string | null;

    'Share Price in euro': number | null;
    'avg trading volume, last 3 months in units in Millions': number | null;
    'avg trading volume in euro in last 3 months in euro in millions': number | null;
    'EPS (earning per share) average for the past 10 years in euro currency': number | null;
    'years to Earnings Match share': number | null;
    'book value per share on average past 10 years in euro currency': number | null;
    'share / book value': number | null;
    'equity average past 10 years in millions euro': number | null;
    'EBITDA average for the past 10 years in euros in millions?': number | null;
    'annual net profit average in the past 10 years, in euros in millions?': number | null;

    'P/E ratio': number | null;
    'Price / book': number | null;
    'return on equity': number | null;
    'market cap in Billions EUR (ask AI) (i.e. hype value... total shares X current share value)': number | null;

    indexesHoldIt: number | null;
    'is held by Billionaires? ( use percentage of total portfolios, MAX 1)': number | null;

    'valuation, max 6': number | null;
    'future growth, 6 max': number | null;
    'past performance, 6 mx': number | null;
    'financial health, max 6': number | null;
    'dividends, max 6': number | null;
    'management, 4 max': number | null;

    // AI analysis stuff
    'degiro (A = 11; B=8; C=4; D=1)': string | number | null;
    DmitriScore: number | string;
    'fitch rating': number | null;
    'moody rating': number | null;
    's&p rating': number | null;

    'avg AI grade': number | null;
    'chatGPT Grade (11 to 1)': number | null;
    'Gemini Pro (RM email)': number | null;
    'ChatGPT Plus': number | null;
    claude: number | null;
    gemini: number | null;
    copilot: number | null;
    perplexity: number | null;
    LeChat: number | null;
    grok: number | null;
    kimi: number | null;
    deepseek: number | null;

    investingComAnalystsScore: number | null;
    'Pure AI Average Grade': number | null;
    'score was by feel': string | null;
};

export type RatingType = string | number | null;
