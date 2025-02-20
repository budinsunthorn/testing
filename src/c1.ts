import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  errorFormat: 'colorless',
})
export interface Context {
  prisma: PrismaClient
}

export const context: Context = {
  prisma: prisma,
}
/*
1. Set Up Your Project
First, ensure you have Node.js installed on your machine. Then, create a new directory for your project and initialize a new Node.js project.

bash
mkdir my-prisma-project  
cd my-prisma-project  
npm init -y  
2. Install Prisma
Install Prisma CLI as a development dependency, along with your preferred database client. For example, if you're using PostgreSQL, you would do:

bash
npm install prisma --save-dev  
npm install @prisma/client  
npm install @prisma/toolkit/packageId/4XvTviY9eurMHvv9wBNRp52zJTyusXkpxbCu2gPqWHHZpzqZJAVPNd9dAPEDduDgQ172GVKQk7AHGWeGky
3. Initialize Prisma
Run the following command to create the prisma directory and a basic configuration file.

bash
npx prisma init  
This will create a prisma folder with a schema.prisma file where you’ll define your data model, and a .env file for environment variables.

4. Configure Database Connection
Open the .env file and configure your database connection string. For example, for PostgreSQL, you might have:

ini
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"  
5. Define Your Data Model
Edit the schema.prisma file to define your data models. Here’s a simple example for a User model:

prisma
model User {  
  id    Int     @id @default(autoincrement())  
  name  String  
  email String  @unique  
}  
6. Run Migrations
After defining your models, run the migration command to set up your database schema:

bash
npx prisma migrate dev --name init  
This command will create a new migration file and apply it to your database.

7. Generate Prisma Client
Now, generate the Prisma Client that you will use to interact with your database:

bash
npx prisma generate  
8. Use Prisma Client in Your Application
You can now use the Prisma Client in your application. Here’s an example of how to create a user:

javascript
// index.js  
const { PrismaClient } = require('@prisma/client');  
const prisma = new PrismaClient();  

async function main() {  
  const user = await prisma.user.create({  
    data: {  
      name: 'Alice',  
      email: 'alice@example.com',  
    },  
  });  
  console.log(user);  
}  

main()  
  .catch(e => {  
    throw e;  
  })  
  .finally(async () => {  
    await prisma.$disconnect();  
  });  
9. Querying and Modifying Data
You can perform various operations, like querying, updating, and deleting records. Here are a few examples:

Find All Users:

javascript
const users = await prisma.user.findMany();  
console.log(users);  
Update a User:

javascript
const updatedUser = await prisma.user.update({  
  where: { id: 1 },  
  data: { name: 'Alice Updated' },  
});  
console.log(updatedUser);  
Delete a User:

javascript
const deletedUser = await prisma.user.delete({  
  where: { id: 1 },  
});  
console.log(deletedUser);  
*/