export interface City {
    name: string;
    state: string;
    country: string;
    priority: number; // Higher is more priority
}

export const COUNTRIES = [
    'India', 'France', 'Germany', 'UK', 'Netherlands', 'Belgium', 'UAE', 
    'Italy', 'Spain', 'USA', 'Canada', 'Australia', 'Singapore'
];

export const STATES_BY_COUNTRY: Record<string, string[]> = {
    'India': [
        'West Bengal', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 
        'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 
        'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 
        'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 
        'Uttar Pradesh', 'Uttarakhand', 'Andaman and Nicobar', 'Chandigarh', 
        'Dadra and Nagar Haveli', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 
        'Lakshadweep', 'Puducherry'
    ],
    'France': ['Île-de-France', 'Provence-Alpes-Côte d\'Azur', 'Auvergne-Rhône-Alpes'],
    'Germany': ['Berlin', 'Hamburg', 'Bavaria', 'North Rhine-Westphalia'],
    'UK': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    'Netherlands': ['North Holland', 'South Holland', 'Utrecht'],
    'Belgium': ['Brussels-Capital', 'Flanders', 'Wallonia'],
    'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah'],
    'Italy': ['Lazio', 'Lombardy', 'Veneto'],
    'Spain': ['Madrid', 'Catalonia', 'Andalusia'],
    'USA': ['NY', 'California', 'Texas', 'Florida'],
    'Canada': ['Ontario', 'British Columbia'],
    'Australia': ['NSW', 'Victoria'],
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
    // INDIA MAJOR (Representative set for all states)
    // -------------------------------------------------------------------------
    { name: 'Visakhapatnam', state: 'Andhra Pradesh', country: 'India', priority: 20 },
    { name: 'Itanagar', state: 'Arunachal Pradesh', country: 'India', priority: 20 },
    { name: 'Guwahati', state: 'Assam', country: 'India', priority: 20 },
    { name: 'Patna', state: 'Bihar', country: 'India', priority: 20 },
    { name: 'Raipur', state: 'Chhattisgarh', country: 'India', priority: 20 },
    { name: 'Panaji', state: 'Goa', country: 'India', priority: 20 },
    { name: 'Ahmedabad', state: 'Gujarat', country: 'India', priority: 50 },
    { name: 'Gurgaon', state: 'Haryana', country: 'India', priority: 20 },
    { name: 'Shimla', state: 'Himachal Pradesh', country: 'India', priority: 20 },
    { name: 'Ranchi', state: 'Jharkhand', country: 'India', priority: 20 },
    { name: 'Bangalore', state: 'Karnataka', country: 'India', priority: 50 },
    { name: 'Kochi', state: 'Kerala', country: 'India', priority: 20 },
    { name: 'Bhopal', state: 'Madhya Pradesh', country: 'India', priority: 20 },
    { name: 'Mumbai', state: 'Maharashtra', country: 'India', priority: 50 },
    { name: 'Imphal', state: 'Manipur', country: 'India', priority: 20 },
    { name: 'Shillong', state: 'Meghalaya', country: 'India', priority: 20 },
    { name: 'Aizawl', state: 'Mizoram', country: 'India', priority: 20 },
    { name: 'Kohima', state: 'Nagaland', country: 'India', priority: 20 },
    { name: 'Bhubaneswar', state: 'Odisha', country: 'India', priority: 20 },
    { name: 'Chandigarh', state: 'Punjab', country: 'India', priority: 20 },
    { name: 'Jaipur', state: 'Rajasthan', country: 'India', priority: 20 },
    { name: 'Gangtok', state: 'Sikkim', country: 'India', priority: 20 },
    { name: 'Chennai', state: 'Tamil Nadu', country: 'India', priority: 50 },
    { name: 'Hyderabad', state: 'Telangana', country: 'India', priority: 50 },
    { name: 'Agartala', state: 'Tripura', country: 'India', priority: 20 },
    { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', priority: 50 },
    { name: 'Dehradun', state: 'Uttarakhand', country: 'India', priority: 20 },
    { name: 'Port Blair', state: 'Andaman and Nicobar', country: 'India', priority: 20 },
    { name: 'New Delhi', state: 'Delhi', country: 'India', priority: 50 },
    { name: 'Srinagar', state: 'Jammu and Kashmir', country: 'India', priority: 20 },
    { name: 'Leh', state: 'Ladakh', country: 'India', priority: 20 },

    // -------------------------------------------------------------------------
    // EUROPEAN MAJOR (High Muslim Population Areas)
    // -------------------------------------------------------------------------
    { name: 'Paris', state: 'Île-de-France', country: 'France', priority: 30 },
    { name: 'Marseille', state: 'Provence-Alpes-Côte d\'Azur', country: 'France', priority: 30 },
    { name: 'Lyon', state: 'Auvergne-Rhône-Alpes', country: 'France', priority: 30 },
    { name: 'Berlin', state: 'Berlin', country: 'Germany', priority: 30 },
    { name: 'Hamburg', state: 'Hamburg', country: 'Germany', priority: 30 },
    { name: 'Cologne', state: 'North Rhine-Westphalia', country: 'Germany', priority: 30 },
    { name: 'London', state: 'England', country: 'UK', priority: 30 },
    { name: 'Birmingham', state: 'England', country: 'UK', priority: 30 },
    { name: 'Manchester', state: 'England', country: 'UK', priority: 30 },
    { name: 'Amsterdam', state: 'North Holland', country: 'Netherlands', priority: 30 },
    { name: 'Rotterdam', state: 'South Holland', country: 'Netherlands', priority: 30 },
    { name: 'Brussels', state: 'Brussels-Capital', country: 'Belgium', priority: 30 },
    { name: 'Antwerp', state: 'Flanders', country: 'Belgium', priority: 30 },
    { name: 'Rome', state: 'Lazio', country: 'Italy', priority: 30 },
    { name: 'Milan', state: 'Lombardy', country: 'Italy', priority: 30 },
    { name: 'Madrid', state: 'Madrid', country: 'Spain', priority: 30 },
    { name: 'Barcelona', state: 'Catalonia', country: 'Spain', priority: 30 },

    // -------------------------------------------------------------------------
    // OTHERS
    // -------------------------------------------------------------------------
    { name: 'Dubai', state: 'Dubai', country: 'UAE', priority: 50 },
    { name: 'Abu Dhabi', state: 'Abu Dhabi', country: 'UAE', priority: 50 },
    { name: 'Toronto', state: 'Ontario', country: 'Canada', priority: 20 },
    { name: 'Sydney', state: 'NSW', country: 'Australia', priority: 20 },
    { name: 'Singapore City', state: 'Singapore', country: 'Singapore', priority: 20 },
];
