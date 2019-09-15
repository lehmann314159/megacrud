# megacrud
This is an extension of the app builder project.  More languages, and RDBMS to pair with Mongo

As I've played around with the app builder, I realized a few shortcomings.

I wanted more languages (golang to start).

I wanted to add a notion of RDBMS to the data layer. In particular I wanted to have a strong relational notion and to create a real-time ETL to mongo from that.  Essentially I wanted to do primary writes to an RDBMS, followed by a write to mongo.  But I wanted simple reads to come from mongo.  So I needed both relations and nesting.

I wanted explicit support for pre- and post-op triggers.  So I'm adding a notion of those triggers.  If they exist, they fire.
