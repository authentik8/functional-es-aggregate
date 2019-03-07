# ES-Aggregate

This package provides my take on an event-sourced aggregate,
allowing a user to configure an aggregate based on it's name,
initial state, command handling & event processing.

## Installation

```bash
npm install @authentik8/es-aggregate
```

## Usage

```javascript
import { createAggregate } from '@authentik8/es-aggregate';

const name = 'Counter'

const initialState = { count: 0 };

const commands = {
  increment: (entity, command) => {
    const { by } = command;
    entity.publish('incremented', { incrementSize: by })
  }
}

const eventHandlers = {
  incremented: (state, event) => ({
    ...state,
    count: state.count + event.incrementSize
  })
}

const aggregate = createAggregate({ 
  name, 
  initialState, 
  commands, 
  eventHandlers 
})
```

