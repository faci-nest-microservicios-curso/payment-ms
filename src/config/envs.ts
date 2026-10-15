import 'dotenv/config'
import * as joi from 'joi'

interface EnvVars {
    PORT: number
    STRIPE_SECRET: string
    DATABASE_URL: string
    NATS_SERVERS: string[]
}

const envSchema = joi.object({
    PORT: joi.number().required(),
    STRIPE_SECRET: joi.string().required()
    // DATABASE_URL: joi.string().required(),
    // NATS_SERVERS: joi.array().items(joi.string()).required(),
}).unknown(true)

const { error, value } = envSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS?.split(',')
})

if (error) {
    throw new Error('Config validation error ' + error.message)
}

const envVars: EnvVars = value

export const envs = {
    port: envVars.PORT,
    stripeSecret: envVars.STRIPE_SECRET,
    databaseUrl: envVars.DATABASE_URL,
    natsServers: envVars.NATS_SERVERS,
}