# Boundaries

Use SigilJS at boundaries where JavaScript receives data from outside a function or module.

A boundary is anything that crosses trust: request payloads, database rows, form submissions, events, queues, webhooks, config files, storage reads, plugin host APIs, and AI tool outputs. Inside that boundary, data is untrusted. After the contract runs, the same data can be treated as trusted runtime data.

Each boundary page follows the same shape: what the boundary does, what value becomes trusted, and which enforcement API fits best.
