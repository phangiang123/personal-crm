-- CreateEnum
CREATE TYPE "Closeness" AS ENUM ('VERY_CLOSE', 'CLOSE', 'SOMEWHAT_CLOSE', 'ACQUAINTANCE', 'NEW');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('A', 'B', 'C', 'D', 'E');

-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('CALL', 'MESSAGE', 'EMAIL', 'MEETING', 'MEAL', 'EVENT', 'WORK', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "address" TEXT,
    "company" TEXT,
    "jobTitle" TEXT,
    "industry" TEXT,
    "birthday" TIMESTAMP(3),
    "avatarUrl" TEXT,
    "closeness" "Closeness" NOT NULL DEFAULT 'NEW',
    "priority" "Priority" NOT NULL DEFAULT 'E',
    "contactFrequencyDays" INTEGER,
    "lastContactDate" TIMESTAMP(3),
    "lastContactType" "InteractionType",
    "lastContactNote" TEXT,
    "nextContactDate" TIMESTAMP(3),
    "theyCanHelpNote" TEXT,
    "iCanHelpNote" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactGroup" (
    "contactId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,

    CONSTRAINT "ContactGroup_pkey" PRIMARY KEY ("contactId","groupId")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactTag" (
    "contactId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "ContactTag_pkey" PRIMARY KEY ("contactId","tagId")
);

-- CreateTable
CREATE TABLE "HelpTopic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "HelpTopic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "InteractionType" NOT NULL,
    "content" TEXT,
    "outcome" TEXT,
    "nextAction" TEXT,
    "followUpDate" TIMESTAMP(3),
    "followUpDone" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TheyHelp" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TheyHelp_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_IHelp" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_IHelp_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Contact_priority_nextContactDate_idx" ON "Contact"("priority", "nextContactDate");

-- CreateIndex
CREATE INDEX "Contact_nextContactDate_idx" ON "Contact"("nextContactDate");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "HelpTopic_name_key" ON "HelpTopic"("name");

-- CreateIndex
CREATE INDEX "Interaction_contactId_date_idx" ON "Interaction"("contactId", "date");

-- CreateIndex
CREATE INDEX "Interaction_followUpDate_followUpDone_idx" ON "Interaction"("followUpDate", "followUpDone");

-- CreateIndex
CREATE INDEX "_TheyHelp_B_index" ON "_TheyHelp"("B");

-- CreateIndex
CREATE INDEX "_IHelp_B_index" ON "_IHelp"("B");

-- AddForeignKey
ALTER TABLE "ContactGroup" ADD CONSTRAINT "ContactGroup_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactGroup" ADD CONSTRAINT "ContactGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactTag" ADD CONSTRAINT "ContactTag_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactTag" ADD CONSTRAINT "ContactTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Interaction" ADD CONSTRAINT "Interaction_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TheyHelp" ADD CONSTRAINT "_TheyHelp_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TheyHelp" ADD CONSTRAINT "_TheyHelp_B_fkey" FOREIGN KEY ("B") REFERENCES "HelpTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IHelp" ADD CONSTRAINT "_IHelp_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IHelp" ADD CONSTRAINT "_IHelp_B_fkey" FOREIGN KEY ("B") REFERENCES "HelpTopic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
