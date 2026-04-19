export interface City {
    name: string;
    state: string;
    country: string;
    priority: number; // Higher is more priority
}

export const COUNTRIES = ['India', 'UK', 'USA', 'UAE', 'Canada', 'Australia', 'Singapore'];

export const STATES_BY_COUNTRY: Record<string, string[]> = {
    'India': [
        'West Bengal', 'Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 'Gujarat', 'Uttar Pradesh', 
        'Kerala', 'Bihar', 'Rajasthan', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Assam', 'Odisha'
    ],
    'UK': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    'USA': ['NY', 'California', 'Texas', 'Florida', 'Illinois', 'Virginia'],
    'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah'],
    'Canada': ['Ontario', 'British Columbia', 'Quebec'],
    'Australia': ['NSW', 'Victoria', 'Queensland'],
    'Singapore': ['Singapore']
};

export const CITIES: City[] = [
    // -------------------------------------------------------------------------
    // WEST BENGAL (Complete - 23 Districts)
    // -------------------------------------------------------------------------
    { name: 'Kolkata', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Howrah', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Darjeeling', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Kalimpong', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Jalpaiguri', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Alipurduar', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Cooch Behar', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Malda', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Uttar Dinajpur', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Dakshin Dinajpur', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Murshidabad', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Nadia', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'North 24 Parganas', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'South 24 Parganas', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Hooghly', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Purba Bardhaman', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Paschim Bardhaman', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Purba Medinipur', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Paschim Medinipur', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Jhargram', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Bankura', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Purulia', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Birbhum', state: 'West Bengal', country: 'India', priority: 100 },

    // -------------------------------------------------------------------------
    // INDIA MAJOR
    // -------------------------------------------------------------------------
    { name: 'Mumbai', state: 'Maharashtra', country: 'India', priority: 50 },
    { name: 'Pune', state: 'Maharashtra', country: 'India', priority: 50 },
    { name: 'New Delhi', state: 'Delhi', country: 'India', priority: 50 },
    { name: 'Bangalore', state: 'Karnataka', country: 'India', priority: 50 },
    { name: 'Hyderabad', state: 'Telangana', country: 'India', priority: 50 },
    { name: 'Chennai', state: 'Tamil Nadu', country: 'India', priority: 50 },
    { name: 'Ahmedabad', state: 'Gujarat', country: 'India', priority: 50 },
    { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', priority: 50 },
    { name: 'Kochi', state: 'Kerala', country: 'India', priority: 50 },
    { name: 'Patna', state: 'Bihar', country: 'India', priority: 50 },
    { name: 'Jaipur', state: 'Rajasthan', country: 'India', priority: 50 },

    // -------------------------------------------------------------------------
    // GLOBAL HUBS
    // -------------------------------------------------------------------------
    { name: 'London', state: 'England', country: 'UK', priority: 10 },
    { name: 'Manchester', state: 'England', country: 'UK', priority: 10 },
    { name: 'Birmingham', state: 'England', country: 'UK', priority: 10 },
    { name: 'New York', state: 'NY', country: 'USA', priority: 10 },
    { name: 'Los Angeles', state: 'California', country: 'USA', priority: 10 },
    { name: 'Dubai', state: 'Dubai', country: 'UAE', priority: 10 },
    { name: 'Abu Dhabi', state: 'Abu Dhabi', country: 'UAE', priority: 10 },
    { name: 'Toronto', state: 'Ontario', country: 'Canada', priority: 10 },
    { name: 'Sydney', state: 'NSW', country: 'Australia', priority: 10 },
    { name: 'Singapore City', state: 'Singapore', country: 'Singapore', priority: 10 },
];
