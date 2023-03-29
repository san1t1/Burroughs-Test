# Payroll Dates Calculator

Tech test Response.

## Contains

- A NestJS server - it's my first ever attempt at Nest, I kinda like it. Especially that you still have access to all the express stuff under the hood.
There's things I don't like about the template app it creates, but that's often the case with these 'get you started quick' pieces. Anyway, this took me a bit longer than knocking something up with express snippets I had lying around.
- A Very Ugly React App - I'm not a UX guy, and I was kinda running out of the time I wanted to spend, so I've done no styling, and no tests. Oh well. Not my best work, but it only took an hour or so to get done
- A production minded docker image can be built.

## Design Decisions

- The API can return either `text/csv` or `application/json` depending on the `Accept` header. Standard content-negotiation stuff.
- This is contract first, so the API doc is handwritten, and not generated from code. This allows much more precise validation in my experience.
- There's a gotcha in this challenge around timezones and daylight saving and all that, especially where server is probably UTC timezone and client is not. As the business logic is not time sensitive, and no mention of how to approach this in the requirements.
I've largely side stepped the issue. Instead of taking a single 'date' parameter in the API, the route is `GET /payroll-dates/year/month/day`, and equally, the response, both in JSON and CSV form, uses `YYYY/MM/DD`. Internally where `Date` is used, the time is set to midday to avoid daylight saving problems.

## Running the thing

To keep things simple, I've packaged it all up into docker compose, so if all is good you should just be able to run `docker-compose up` and it 'just works'

You've got these routes:

- [http://127.0.0.1:5000/](http://127.0.0.1:5000/) - the react app, consuming the api. I've just built it in the multi-stage docker build, and serve it statically.
- [http://127.0.0.1:5000/api-docs](http://127.0.0.1:5000/api-docs) - Swagger docs. The 'Try it out' button should be functional.
- [http://127.0.0.1:5000/schema](http://127.0.0.1:5000/schema) - The raw OpenAPI schema. I just kinda like to do this, but it might be overkill. I'll normally have an unauthenticated `/version` route as well.

## Tests

```bash
cd server
npm install
npm run test
npm run test:e2e
```

Just failed to get to do any client tests. Ran out of time. Also I'd generally look to combine those two test steps and run once in CI. See above comment on the Nest template.

### Development

You'll need two terminals. In the first

```bash
cd server
npm install
npm run start:dev
```

And in the second

```bash
cd client
npm install
npm run start
```
