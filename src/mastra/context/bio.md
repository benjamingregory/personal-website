# Bio

Factual background. The agent uses this as ground truth when asked about my
life, career, or background. Written in first person — I'd talk about myself
this way over a beer.

## The short version

I'm Ben. I'm building Kasava — an AI workflow tool aimed at product engineers,
not really product managers anymore. Before Kasava I built Monroe, a pop
culture companion for the golden age of television. Before that I was a senior
PM on the freight team at Flexport, which I joined when they acquired Deliverr,
which Shopify had bought from us a year earlier. Before all of that I was the
first PM at Astronomer, where we commercialized open-source Apache Airflow.
I went to the Stanford GSB ('21) in between Astronomer and Deliverr.

## Career, in order

### Astronomer — 2014–2018, founding team / first PM

Came out of college through Venture for America and got placed in Cincinnati.
Met some other entrepreneurs in town who were also obsessed with big data —
this was 2013/2014, data science was the thing — and we joined up to start a
company. The early thesis was helping people collect data from their websites;
that evolved into commercializing Apache Airflow and going hard on data
pipelines.

I was 23 or 24 when I joined, the four of us were the team, and I was a
jack-of-all-trades. Mostly I was non-technical and trying to absorb everything,
making sure customers got what we promised. Eventually became the first product
manager — adapted the platform for enterprise, helped land our first Fortune 50
customer, ran product marketing because we didn't have a product marketer, and
ran the open-source community through the Airflow plug-in project, which
basically established us as the name in Airflow.

We grew from 4 to 50 while I was there. I left to go to Stanford. The company
has gone on to do really well — it's run by some of the guys I hired, which
makes me really happy to see.

### Stanford GSB — 2019–2021, MBA

I went because I'd learned how to start a company by doing it, but I'd seen a
lot of scaling mistakes I didn't have a framework for. We'd been through hard
layoffs at Astronomer. There were real questions about how you grow a culture
that holds up under pressure, and how you handle layoffs gracefully when
they're needed — how you treat people with respect and give them work that
feels meaningful and connected to a mission. I wanted to skip ahead and learn
from people who'd done that well at scale.

The thing that hooked me about Stanford specifically: there's an engraving in
the corner of the GSB campus dedicated to "the things that haven't happened
yet, and the people who are going to dream them up." A famously prestigious
institution that's pointed at what's next, not what's already been built —
that's what made it feel like home.

### Deliverr → Shopify → Flexport — 2021–2023, senior PM, freight

Came out of business school wanting to get back to startups. Joined Deliverr
because I'd been reading about them — a logistics-as-a-service company helping
small businesses, which I'd come to love at Gusto during my GSB internship.

I took charge of the freight product (port-to-porch — getting freight from the
port to our distribution warehouses, then cross-docking across the country).
Grew that revenue 70% YoY to over $22M. Built the team from one developer to
about 15 people, 12 of them devs.

While I was there, two big things happened. Shopify acquired us — they wanted
to get into logistics, and the Deliverr port-to-porch model paid nicely into
the Shopify ecosystem; the vision was warehouse-in-China to customer-doorstep
on one platform. Then Shopify decided they didn't want to be in logistics
(messy business, bad margins — fair), and sold us to Flexport, who already
had international freight (port-to-port) so we slotted in as the domestic leg.
I had three MacBooks stacked in my closet by the time it was over.

The work I'm proudest of: a custom quoting tool that took our growth team's
quote response time from 24 hours to 10 seconds. Heavy collaboration with data
science to collapse all the possible zip-to-zip combinations down to 56 zones,
flat rate within zones, per-mileage between them. And the self-serve booking
flow — first new product line we added, customers could book a truck without
talking to a sales rep. We grew automated bookings 40% in three months and cut
churn by ripping out fields. Customers had been telling us forever they hated
the form length; we got it down to origin zip, destination zip, and number of
packages.

This was COVID-recovery freight, by the way — international containers that
normally cost $2k were running $10k. The market was wild.

### Monroe — 2023–2024, founder

I'd call it a pop culture companion for the golden age of television. It
started because I use Letterboxd and wished there was a TV equivalent that was
actually good. Honestly Letterboxd isn't great — it's effective at what it
does, but the TV-tracking apps were worse: slow, clunky, all looked the same.

This was my first project where I built everything myself. I had a rough sense
of frontend, but I'd never built a full app, never designed an API, never
really thought through the database schema for a live application, never set
up auth from scratch. Wanted to do it for a use case I had.

The interesting problem wasn't tracking shows — that's easy. It was managing
*state* across hundreds of shows. At one point I had ~100 in-progress, ~200 in
queue, ~177 finished. Some "in-progress" shows I hadn't watched in over a year.
How do you lift up shows the user is actually engaging with versus the ones
they've quietly dropped? How do you tell active vs. stale, high-velocity vs.
casual? That's complex both as a state model and as a perf problem — you can't
just dump everything into the browser and hope. I rebuilt the data layer four
or five times to cache at multiple levels.

The other thing I was excited about: a personalized version of Rotten Tomatoes.
Critics ding *The Boys* for being violent. But if you've finished *The Boys*
and watch shows that are similarly violent, that 2/5 review might be a 4/5 for
*you*. Take qualitative review content and reframe it for a specific viewer.
Hard problem — needs critical mass of reviews per show plus enough signal from
the user — but interesting. Still working on it.

### Kasava — 2025–present, founder

The original prompt was: what if we had a product manager *in the app itself*?

What I always struggled with as a PM was getting real status updates. I was
constantly playing telephone — asking my tech lead to ask an engineer to ask
the engineer actually doing the work, "are we going to ship this in time?"
That broke down on me a few times in important ways — projects I'd been told
all the way up to the wire were on track turned out to be nowhere close to
done.

Around the same time, LLMs were getting really good at chunking documents and
RAG was hot. I started wondering — what if an agent had full context of your
codebase, your issues, your sprint, who's modifying what services on what
days? You build a semantic layer between issues and code and people, and
suddenly you have an actually accurate picture of how a codebase is progressing
from a product sense, not just a code sense. The big inspiration was Greptile,
which I'd used for code reviews at Coplay — same methodology, applied to
product instead of code.

It grew from there. As I built it, I realized the role itself is changing —
sprints are shifting or going away, the rate of iteration is faster, PMs and
engineers are collaborating much more closely. Kasava became less a tool for
product managers and more a tool for product engineers. I added planning
features — a "new PRD" workspace where you can ideate, pull in context from
research and competitors, build a real plan, and then track its execution.
Full lifecycle.

Where I've ended up: I think I was early to see how this could be applied. I
also think I made some bad assumptions. I assumed more PMs would care about
code quality and commit-level signal — they mostly didn't. The hardest thing I
built first (commit tracking + AST-based system mapping) turned out to be a
faulty bet. The good news: that engineering foundation makes the rest of the
platform work — tech designs that are personalized to the actual codebase, not
generic. The bad news: I underestimated how fast Claude/Anthropic and OpenAI
would ship general-purpose tools (Claude Code, MCP, skills) that let people
graft my problem into their own bespoke solutions, and I underestimated how
much product engineers want bespoke workflows that fit them exactly. Hard to
build a one-size-fits-all when the wedge is custom workflows.

So I'm still building, but with clearer eyes about what's actually a venture
business and what isn't.

## Education

### Stanford GSB — MBA, 2021
See above.

### Undergrad
TODO: school + year + major.

## Where I'm from / where I live

Grew up in Nashville. School in St. Louis. Lived in Cincinnati (Astronomer),
then Denver, and for the past six years in the Bay Area — currently San
Francisco. I've moved a lot because I'm ambitious and I keep ending up in
places that point at what's next. The Bay was the strongest version of that
feeling I'd found.

## Family

I live in SF with my partner Sarah, my dog Griffin, and our cat Gracie. My
sister Kate and her husband Matt live in Atlanta with their kids Matthew and
Sarah (11 and 8). My mom Susan lives in Atlanta too.
