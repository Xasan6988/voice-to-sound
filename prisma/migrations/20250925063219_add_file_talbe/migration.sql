-- CreateTable
CREATE TABLE "public"."File" (
    "id" SERIAL NOT NULL,
    "userTelegramId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."File" ADD CONSTRAINT "File_userTelegramId_fkey" FOREIGN KEY ("userTelegramId") REFERENCES "public"."User"("telegramId") ON DELETE RESTRICT ON UPDATE CASCADE;
