class LinkedInSearchBuilder {
    constructor() {
        this.baseUrl = 'https://www.linkedin.com/search/results/people/?keywords=';
        this.searchParams = {
            company: [],
            role: [],
            university: [],
            location: [],
            industry: [],
            skills: []
        };
    }

    // Add company names to search
    addCompanies(...companies) {
        this.searchParams.company.push(...companies);
        return this;
    }

    // Add role titles to search
    addRoles(...roles) {
        this.searchParams.role.push(...roles);
        return this;
    }

    // Add universities to search
    addUniversities(...universities) {
        this.searchParams.university.push(...universities);
        return this;
    }

    // Add locations to search
    addLocations(...locations) {
        this.searchParams.location.push(...locations);
        return this;
    }

    // Add industries to search
    addIndustries(...industries) {
        this.searchParams.industry.push(...industries);
        return this;
    }

    // Add skills to search
    addSkills(...skills) {
        this.searchParams.skills.push(...skills);
        return this;
    }

    // Clean and format search terms
    _formatSearchTerm(term) {
        return term.trim().replace(/\s+/g, ' ').replace(/[^a-zA-Z0-9\s]/g, '');
    }

    // Build company specific query
    _buildCompanyQuery() {
        return this.searchParams.company
            .map(company => `"${this._formatSearchTerm(company)}"`)
            .join(' OR ');
    }

    // Build role specific query
    _buildRoleQuery() {
        return this.searchParams.role
            .map(role => `"${this._formatSearchTerm(role)}"`)
            .join(' OR ');
    }

    // Build education query
    _buildEducationQuery() {
        return this.searchParams.university
            .map(uni => `"${this._formatSearchTerm(uni)}"`)
            .join(' OR ');
    }

    // Build location query
    _buildLocationQuery() {
        return this.searchParams.location
            .map(location => `"${this._formatSearchTerm(location)}"`)
            .join(' OR ');
    }

    // Build industry query
    _buildIndustryQuery() {
        return this.searchParams.industry
            .map(industry => `"${this._formatSearchTerm(industry)}"`)
            .join(' OR ');
    }

    // Build skills query
    _buildSkillsQuery() {
        return this.searchParams.skills
            .map(skill => `"${this._formatSearchTerm(skill)}"`)
            .join(' OR ');
    }

    // Generate the final search URL
    buildSearchUrl() {
        const queryParts = [];

        // Add non-empty query parts
        if (this.searchParams.company.length) {
            queryParts.push(`(${this._buildCompanyQuery()})`);
        }
        if (this.searchParams.role.length) {
            queryParts.push(`(${this._buildRoleQuery()})`);
        }
        if (this.searchParams.university.length) {
            queryParts.push(`(${this._buildEducationQuery()})`);
        }
        if (this.searchParams.location.length) {
            queryParts.push(`(${this._buildLocationQuery()})`);
        }
        if (this.searchParams.industry.length) {
            queryParts.push(`(${this._buildIndustryQuery()})`);
        }
        if (this.searchParams.skills.length) {
            queryParts.push(`(${this._buildSkillsQuery()})`);
        }

        // Join all parts with AND operator
        const searchQuery = queryParts.join(' AND ');
        
        // Encode the query for URL
        const encodedQuery = encodeURIComponent(searchQuery);
        
        return `${this.baseUrl}${encodedQuery}`;
    }

    // Clear all search parameters
    clear() {
        Object.keys(this.searchParams).forEach(key => {
            this.searchParams[key] = [];
        });
        return this;
    }
}

// Example usage:
const searchBuilder = new LinkedInSearchBuilder();

// Build a search query
const searchUrl = searchBuilder
    .addCompanies('Google', 'Microsoft')
    .addRoles('Software Engineer', 'Senior Developer')
    .addUniversities('Stanford University')
    .addLocations('San Francisco Bay Area')
    .addSkills('Python', 'Machine Learning')
    .buildSearchUrl();

console.log(searchUrl);

// Clear and build another search
searchBuilder.clear()
    .addCompanies('Amazon')
    .addRoles('Product Manager')
    .addLocations('Seattle')
    .buildSearchUrl();