const { gql } = require('graphql-tag');

// Using gql-tag to define schema strings compatible with Apollo Server
const typeDefs = gql`
  scalar JSON

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
    busNumber: String
    routeAssignment: String
    licenseNumber: String
    phoneNumber: String
    isActive: Boolean!
    lastLogin: String
    profileImage: String
    createdAt: String
    updatedAt: String
  }

  type Coordinates {
    latitude: Float!
    longitude: Float!
  }

  type Stop {
    name: String!
    coordinates: Coordinates!
    estimatedTime: Int!
    order: Int!
  }

  type Route {
    id: ID!
    name: String!
    routeNumber: String!
    description: String
    stops: [Stop!]!
    totalDistance: Float!
    estimatedDuration: Int!
    fare: Float!
    isActive: Boolean!
    operatingHours: JSON
    frequency: Int!
    createdAt: String
    updatedAt: String
  }

  type Schedule {
    id: ID!
    routeId: ID!
    driverId: ID
    departureTime: String
    actualDepartureTime: String
    status: String
    passengerCount: Int
    createdAt: String
    updatedAt: String
  }

  type Incident {
    id: ID!
    type: String!
    status: String!
    severity: String!
    description: String
    reportedBy: JSON
    assignedTo: JSON
    createdAt: String
    updatedAt: String
  }

  type Pagination {
    current: Int!
    pages: Int!
    total: Int!
    hasNext: Boolean!
    hasPrev: Boolean!
  }

  type DriversResult {
    items: [User!]!
    pagination: Pagination!
  }

  type DashboardMetrics {
    totalDrivers: Int!
    activeRoutes: Int!
    todaySchedules: Int!
    openIncidents: Int!
    onTimePerformance: Int!
    averageDelay: Int!
    totalPassengers: Int!
  }

  type DashboardData {
    metrics: DashboardMetrics!
    recentIncidents: [Incident!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input DriversFilter {
    page: Int
    limit: Int
    search: String
    status: String
  }

  input CompleteScheduleInput {
    passengerCount: Int
    notes: String
  }

  type Query {
    health: String!
    me: User
    drivers(filter: DriversFilter): DriversResult!
    routes: [Route!]!
    route(id: ID!): Route
    adminDashboard: DashboardData!
  }

  type Mutation {
    login(email: String!, password: String!, role: String!): AuthPayload!
    updateDriver(
      id: ID!,
      name: String,
      phoneNumber: String,
      busNumber: String,
      routeAssignment: String,
      licenseNumber: String,
      isActive: Boolean
    ): User!
  }
`;

module.exports = { typeDefs };
