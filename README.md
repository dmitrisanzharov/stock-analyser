## How to add a company
- copy one of the companies, and repopulate it with new values
- then add it to 'allCompanies.ts' array = done


## Old Single Stock Analyzer
- https://docs.google.com/spreadsheets/d/1VW12SI3Q3UFKWGPSXnIImWCU4ob80-pYl4YfzX6U0pA/edit?gid=873466011#gid=873466011


## 5-Oct-2025
- Added export const COMPANY_ANALYZED = 'Eni SpA';  that controls: const data = useGetData(!Boolean(COMPANY_ANALYZED)); in basic table
- so when company is ANALYZED_ON... i.e. there is a string present in company analyzed, there is NO FILTERING OF DATA into the table



## 27-Sep-2025
- No longer use AI analyzer seriously and mostly focusing on MY analyzer
- Moved AI analyzer to a single CELL score that will be used with Weight of 7
    Reason is: it misses good companies and sometimes assigns strange numbers to 'uncertain' companies
- Basically I prefer to use my own head, rather than let AI decide, for the time being


## 24-Sep-2025
- added new criterias (all are 10 in weight):
    net profit margin 5ya
    ROE 5ya
    5 Year EPS Growth
    5 Year Sales Growth
    Net Income/Employee

- removed (no longer relevant):
    stock chart