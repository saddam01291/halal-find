export interface City {
    name: string;
    state: string;
    country: string;
    priority: number; // Higher is more priority
}

export const CITIES: City[] = [
    // West Bengal (Priority 100)
    { name: 'Kolkata', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Burdwan', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Asansol', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Durgapur', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Siliguri', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Kharagpur', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Darjeeling', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Haldia', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Howrah', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Malda', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Bahampur', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Habra', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Shantipur', state: 'West Bengal', country: 'India', priority: 100 },
    { name: 'Dankuni', state: 'West Bengal', country: 'India', priority: 100 },

    // India Major (Priority 50)
    { name: 'Mumbai', state: 'Maharashtra', country: 'India', priority: 50 },
    { name: 'Delhi', state: 'Delhi', country: 'India', priority: 50 },
    { name: 'Bangalore', state: 'Karnataka', country: 'India', priority: 50 },
    { name: 'Hyderabad', state: 'Telangana', country: 'India', priority: 50 },
    { name: 'Chennai', state: 'Tamil Nadu', country: 'India', priority: 50 },
    { name: 'Pune', state: 'Maharashtra', country: 'India', priority: 50 },
    { name: 'Ahmedabad', state: 'Gujarat', country: 'India', priority: 50 },
    { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', priority: 50 },

    // Global (Priority 10)
    { name: 'London', state: 'England', country: 'UK', priority: 10 },
    { name: 'New York', state: 'NY', country: 'USA', priority: 10 },
    { name: 'Dubai', state: 'Dubai', country: 'UAE', priority: 10 },
    { name: 'Singapore', state: 'Singapore', country: 'Singapore', priority: 10 },
    { name: 'Toronto', state: 'Ontario', country: 'Canada', priority: 10 },
    { name: 'Sydney', state: 'NSW', country: 'Australia', priority: 10 },
];
