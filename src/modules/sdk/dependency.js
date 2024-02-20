import { XMLParser } from 'fast-xml-parser'
const MiddlewareDict = {
    'org.mongodb:mongo-java-driver': 'mongodb',
    'org.mongodb:mongodb-driver-sync': 'mongodb',
    'com.mysql:mysql-connector-j': 'mysql',
    'mysql:mysql-connector-java': 'mysql',
    'com.h2database:h2': 'h2',
    'com.oracle.database.jdbc:ojdbc10': 'oracle',
    'io.lettuce:lettuce-core': 'redis',
    'org.apache.pulsar:pulsar-client': 'pulsar',
    'com.rabbitmq:amqp-client': 'rabbitmq',
    'org.apache.kafka:kafka_2.13': 'kafka',
    'org.apache.activemq:activemq-client': 'activemq'
}
export const buildSDKTemplate = pomString => {
    const sdk = {
        version: '1.0.0',
        dependencies: {}
    }
    if (!pomString) {
        return sdk
    }
    const parser = new XMLParser()
    const result = parser.parse(pomString)
    const dependencies = result.project.dependencies.dependency
    sdk.version = result.project.version ?? '1.0.0'
    dependencies.forEach(dependency => {
        const groupId = dependency.groupId
        const artifactId = dependency.artifactId
        const version = dependency.version
        const key = `${groupId}:${artifactId}`
        if (MiddlewareDict[key]) {
            sdk.dependencies[MiddlewareDict[key]] = {
                groupId,
                artifactId,
                version
            }
        }
    })
    return sdk
}
