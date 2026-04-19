export interface City {
    name: string;
    state: string;
    country: string;
    priority: number; // Higher is more priority
}

export const COUNTRIES = [
    'India', 'USA', 'UK', 'UAE', 'Canada', 'France', 'Germany', 'Malaysia', 
    'Indonesia', 'Turkey', 'Singapore', 'Australia', 'Netherlands', 
    'Belgium', 'Italy', 'Spain', 'South Africa', 'Sweden', 'Switzerland'
];

export const STATES_BY_COUNTRY: Record<string, string[]> = {
    'India': [
        'West Bengal', 'Maharashtra', 'Delhi', 'Karnataka', 'Telangana', 'Tamil Nadu', 
        'Uttar Pradesh', 'Gujarat', 'Kerala', 'Bihar', 'Rajasthan', 'Punjab', 
        'Andhra Pradesh', 'Assam', 'Madhya Pradesh', 'Haryana', 'Odisha', 
        'Jammu and Kashmir', 'Jharkhand', 'Chhattisgarh', 'Uttarakhand', 'Himachal Pradesh', 
        'Tripura', 'Meghalaya', 'Manipur', 'Nagaland', 'Mizoram', 'Goa', 'Sikkim', 'Arunachal Pradesh',
        'Chandigarh', 'Puducherry', 'Andaman and Nicobar', 'Ladakh', 'Lakshadweep', 'DNHDD'
    ],
    'USA': [
        'California', 'Texas', 'New York', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 
        'Georgia', 'Michigan', 'North Carolina', 'New Jersey', 'Virginia', 'Washington', 
        'Massachusetts', 'Arizona', 'Maryland', 'Indiana', 'Tennessee', 'Missouri', 
        'Wisconsin', 'Colorado', 'Minnesota', 'South Carolina', 'Alabama', 'Louisiana', 
        'Kentucky', 'Oregon', 'Oklahoma', 'Connecticut', 'Utah', 'Iowa', 'Nevada', 
        'Arkansas', 'Mississippi', 'Kansas', 'New Mexico', 'Nebraska', 'Idaho', 
        'West Virginia', 'Hawaii', 'New Hampshire', 'Maine', 'Rhode Island', 
        'Montana', 'Delaware', 'South Dakota', 'North Dakota', 'Alaska', 'District of Columbia', 'Vermont', 'Wyoming'
    ],
    'UK': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    'UAE': ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Fujairah', 'Ras Al Khaimah', 'Umm Al Quwain'],
    'Canada': ['Ontario', 'British Columbia', 'Quebec', 'Alberta', 'Manitoba', 'Saskatchewan'],
    'France': ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Provence-Alpes-Côte d\'Azur', 'Hauts-de-France'],
    'Germany': ['Berlin', 'Bavaria', 'North Rhine-Westphalia', 'Hamburg', 'Hesse', 'Baden-Württemberg'],
    'Malaysia': ['Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Perak'],
    'Indonesia': ['Jakarta', 'West Java', 'East Java', 'Central Java', 'Bali'],
    'Turkey': ['Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa'],
    'Singapore': ['Singapore'],
    'Australia': ['NSW', 'Victoria', 'Queensland', 'Western Australia'],
    'Netherlands': ['North Holland', 'South Holland', 'Utrecht'],
    'Belgium': ['Brussels-Capital', 'Flanders', 'Wallonia'],
    'Italy': ['Lazio', 'Lombardy', 'Veneto', 'Tuscany'],
    'Spain': ['Madrid', 'Catalonia', 'Andalusia', 'Valencia'],
    'South Africa': ['Gauteng', 'Western Cape', 'KwaZulu-Natal'],
    'Sweden': ['Stockholm', 'Skåne', 'Västra Götaland'],
    'Switzerland': ['Zurich', 'Geneva', 'Vaud']
};

export const CITIES: City[] = [
    // -------------------------------------------------------------------------
    // WEST BENGAL (23 Districts - Priority 100)
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
    // INDIA (Major Hubs Across All States)
    // -------------------------------------------------------------------------
    { name: 'Mumbai', state: 'Maharashtra', country: 'India', priority: 80 },
    { name: 'Pune', state: 'Maharashtra', country: 'India', priority: 80 },
    { name: 'Nagpur', state: 'Maharashtra', country: 'India', priority: 80 },
    { name: 'New Delhi', state: 'Delhi', country: 'India', priority: 80 },
    { name: 'Bangalore', state: 'Karnataka', country: 'India', priority: 80 },
    { name: 'Mysore', state: 'Karnataka', country: 'India', priority: 80 },
    { name: 'Hyderabad', state: 'Telangana', country: 'India', priority: 80 },
    { name: 'Warangal', state: 'Telangana', country: 'India', priority: 80 },
    { name: 'Chennai', state: 'Tamil Nadu', country: 'India', priority: 80 },
    { name: 'Madurai', state: 'Tamil Nadu', country: 'India', priority: 80 },
    { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', priority: 80 },
    { name: 'Kanpur', state: 'Uttar Pradesh', country: 'India', priority: 80 },
    { name: 'Varanasi', state: 'Uttar Pradesh', country: 'India', priority: 80 },
    { name: 'Ahmedabad', state: 'Gujarat', country: 'India', priority: 80 },
    { name: 'Surat', state: 'Gujarat', country: 'India', priority: 80 },
    { name: 'Kochi', state: 'Kerala', country: 'India', priority: 80 },
    { name: 'Thiruvananthapuram', state: 'Kerala', country: 'India', priority: 80 },
    { name: 'Patna', state: 'Bihar', country: 'India', priority: 80 },
    { name: 'Gaya', state: 'Bihar', country: 'India', priority: 80 },
    { name: 'Jaipur', state: 'Rajasthan', country: 'India', priority: 80 },
    { name: 'Jodhpur', state: 'Rajasthan', country: 'India', priority: 80 },
    { name: 'Amritsar', state: 'Punjab', country: 'India', priority: 80 },
    { name: 'Ludhiana', state: 'Punjab', country: 'India', priority: 80 },
    { name: 'Chandigarh', state: 'Chandigarh', country: 'India', priority: 80 },
    { name: 'Bhopal', state: 'Madhya Pradesh', country: 'India', priority: 80 },
    { name: 'Indore', state: 'Madhya Pradesh', country: 'India', priority: 80 },
    { name: 'Guwahati', state: 'Assam', country: 'India', priority: 80 },
    { name: 'Bhubaneswar', state: 'Odisha', country: 'India', priority: 80 },
    { name: 'Srinagar', state: 'Jammu and Kashmir', country: 'India', priority: 80 },
    { name: 'Jammu', state: 'Jammu and Kashmir', country: 'India', priority: 80 },
    { name: 'Ranchi', state: 'Jharkhand', country: 'India', priority: 80 },
    { name: 'Raipur', state: 'Chhattisgarh', country: 'India', priority: 80 },
    { name: 'Dehradun', state: 'Uttarakhand', country: 'India', priority: 80 },
    { name: 'Shimla', state: 'Himachal Pradesh', country: 'India', priority: 80 },
    { name: 'Panaji', state: 'Goa', country: 'India', priority: 80 },
    { name: 'Agartala', state: 'Tripura', country: 'India', priority: 80 },
    { name: 'Shillong', state: 'Meghalaya', country: 'India', priority: 80 },
    { name: 'Imphal', state: 'Manipur', country: 'India', priority: 80 },
    { name: 'Kohima', state: 'Nagaland', country: 'India', priority: 80 },
    { name: 'Aizawl', state: 'Mizoram', country: 'India', priority: 80 },
    { name: 'Itanagar', state: 'Arunachal Pradesh', country: 'India', priority: 80 },
    { name: 'Gangtok', state: 'Sikkim', country: 'India', priority: 80 },
    { name: 'Port Blair', state: 'Andaman and Nicobar', country: 'India', priority: 80 },
    { name: 'Leh', state: 'Ladakh', country: 'India', priority: 80 },

    // -------------------------------------------------------------------------
    // USA (Expanded States & Cities - Priority 50)
    // -------------------------------------------------------------------------
    { name: 'New York City', state: 'New York', country: 'USA', priority: 50 },
    { name: 'Buffalo', state: 'New York', country: 'USA', priority: 50 },
    { name: 'Los Angeles', state: 'California', country: 'USA', priority: 50 },
    { name: 'San Francisco', state: 'California', country: 'USA', priority: 50 },
    { name: 'San Diego', state: 'California', country: 'USA', priority: 50 },
    { name: 'Houston', state: 'Texas', country: 'USA', priority: 50 },
    { name: 'Dallas', state: 'Texas', country: 'USA', priority: 50 },
    { name: 'Austin', state: 'Texas', country: 'USA', priority: 50 },
    { name: 'Chicago', state: 'Illinois', country: 'USA', priority: 50 },
    { name: 'Miami', state: 'Florida', country: 'USA', priority: 50 },
    { name: 'Orlando', state: 'Florida', country: 'USA', priority: 50 },
    { name: 'Philadelphia', state: 'Pennsylvania', country: 'USA', priority: 50 },
    { name: 'Atlanta', state: 'Georgia', country: 'USA', priority: 50 },
    { name: 'Detroit', state: 'Michigan', country: 'USA', priority: 50 },
    { name: 'Dearborn', state: 'Michigan', country: 'USA', priority: 50 },
    { name: 'Charlotte', state: 'North Carolina', country: 'USA', priority: 50 },
    { name: 'Jersey City', state: 'New Jersey', country: 'USA', priority: 50 },
    { name: 'Paterson', state: 'New Jersey', country: 'USA', priority: 50 },
    { name: 'Seattle', state: 'Washington', country: 'USA', priority: 50 },
    { name: 'Boston', state: 'Massachusetts', country: 'USA', priority: 50 },
    { name: 'Phoenix', state: 'Arizona', country: 'USA', priority: 50 },
    { name: 'Denver', state: 'Colorado', country: 'USA', priority: 50 },
    { name: 'Minneapolis', state: 'Minnesota', country: 'USA', priority: 50 },
    { name: 'Washington D.C.', state: 'District of Columbia', country: 'USA', priority: 50 },

    // -------------------------------------------------------------------------
    // UK (Priority 50)
    // -------------------------------------------------------------------------
    { name: 'London', state: 'England', country: 'UK', priority: 50 },
    { name: 'Birmingham', state: 'England', country: 'UK', priority: 50 },
    { name: 'Manchester', state: 'England', country: 'UK', priority: 50 },
    { name: 'Leeds', state: 'England', country: 'UK', priority: 50 },
    { name: 'Glasgow', state: 'Scotland', country: 'UK', priority: 50 },
    { name: 'Edinburgh', state: 'Scotland', country: 'UK', priority: 50 },
    { name: 'Cardiff', state: 'Wales', country: 'UK', priority: 50 },
    { name: 'Belfast', state: 'Northern Ireland', country: 'UK', priority: 50 },

    // -------------------------------------------------------------------------
    // MIDDLE EAST & SE ASIA (Priority 50)
    // -------------------------------------------------------------------------
    { name: 'Dubai', state: 'Dubai', country: 'UAE', priority: 50 },
    { name: 'Abu Dhabi', state: 'Abu Dhabi', country: 'UAE', priority: 50 },
    { name: 'Sharjah', state: 'Sharjah', country: 'UAE', priority: 50 },
    { name: 'Kuala Lumpur', state: 'Kuala Lumpur', country: 'Malaysia', priority: 50 },
    { name: 'Penang', state: 'Penang', country: 'Malaysia', priority: 50 },
    { name: 'Jakarta', state: 'Jakarta', country: 'Indonesia', priority: 50 },
    { name: 'Surabaya', state: 'East Java', country: 'Indonesia', priority: 50 },
    { name: 'Bandung', state: 'West Java', country: 'Indonesia', priority: 50 },
    { name: 'Istanbul', state: 'Istanbul', country: 'Turkey', priority: 50 },
    { name: 'Ankara', state: 'Ankara', country: 'Turkey', priority: 50 },
    { name: 'Singapore City', state: 'Singapore', country: 'Singapore', priority: 50 },

    // -------------------------------------------------------------------------
    // EUROPE (Priority 30)
    // -------------------------------------------------------------------------
    { name: 'Paris', state: 'Île-de-France', country: 'France', priority: 30 },
    { name: 'Marseille', state: 'Provence-Alpes-Côte d\'Azur', country: 'France', priority: 30 },
    { name: 'Lyon', state: 'Auvergne-Rhône-Alpes', country: 'France', priority: 30 },
    { name: 'Berlin', state: 'Berlin', country: 'Germany', priority: 30 },
    { name: 'Hamburg', state: 'Hamburg', country: 'Germany', priority: 30 },
    { name: 'Munich', state: 'Bavaria', country: 'Germany', priority: 30 },
    { name: 'Cologne', state: 'North Rhine-Westphalia', country: 'Germany', priority: 30 },
    { name: 'Amsterdam', state: 'North Holland', country: 'Netherlands', priority: 30 },
    { name: 'Rotterdam', state: 'South Holland', country: 'Netherlands', priority: 30 },
    { name: 'Brussels', state: 'Brussels-Capital', country: 'Belgium', priority: 30 },
    { name: 'Antwerp', state: 'Flanders', country: 'Belgium', priority: 30 },
    { name: 'Rome', state: 'Lazio', country: 'Italy', priority: 30 },
    { name: 'Milan', state: 'Lombardy', country: 'Italy', priority: 30 },
    { name: 'Madrid', state: 'Madrid', country: 'Spain', priority: 30 },
    { name: 'Barcelona', state: 'Catalonia', country: 'Spain', priority: 30 },
    { name: 'Granada', state: 'Andalusia', country: 'Spain', priority: 30 },
    { name: 'Stockholm', state: 'Stockholm', country: 'Sweden', priority: 30 },
    { name: 'Malmo', state: 'Skåne', country: 'Sweden', priority: 30 },
    { name: 'Zurich', state: 'Zurich', country: 'Switzerland', priority: 30 },
    { name: 'Geneva', state: 'Geneva', country: 'Switzerland', priority: 30 },

    // -------------------------------------------------------------------------
    // GLOBAL OTHER (Priority 20)
    // -------------------------------------------------------------------------
    { name: 'Toronto', state: 'Ontario', country: 'Canada', priority: 20 },
    { name: 'Vancouver', state: 'British Columbia', country: 'Canada', priority: 20 },
    { name: 'Montreal', state: 'Quebec', country: 'Canada', priority: 20 },
    { name: 'Calgary', state: 'Alberta', country: 'Canada', priority: 20 },
    { name: 'Sydney', state: 'NSW', country: 'Australia', priority: 20 },
    { name: 'Melbourne', state: 'Victoria', country: 'Australia', priority: 20 },
    { name: 'Cape Town', state: 'Western Cape', country: 'South Africa', priority: 20 },
    { name: 'Johannesburg', state: 'Gauteng', country: 'South Africa', priority: 20 },
    { name: 'Durban', state: 'KwaZulu-Natal', country: 'South Africa', priority: 20 },
];
