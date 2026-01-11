import mitt, { Emitter } from 'mitt'

// Define event types for better type safety
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Events = Record<string, any>

const emitter: Emitter<Events> = mitt<Events>()

export default emitter
