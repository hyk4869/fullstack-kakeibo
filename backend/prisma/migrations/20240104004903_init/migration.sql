-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "userID" VARCHAR(100) NOT NULL,
    "email" VARCHAR(250) NOT NULL,
    "password" VARCHAR(250) NOT NULL,
    "color" VARCHAR(20),
    "lastLoginAt" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "sessionId" VARCHAR(250) NOT NULL,
    "userId" UUID NOT NULL,
    "token" VARCHAR(250) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TMonthlySpending" (
    "id" UUID NOT NULL,
    "sort" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "paymentDay" TIMESTAMPTZ NOT NULL,
    "store" VARCHAR(250) NOT NULL,
    "categoryId" UUID NOT NULL,
    "usageFee" INTEGER NOT NULL,
    "notes" VARCHAR(250),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "TMonthlySpending_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TSalary" (
    "id" UUID NOT NULL,
    "sort" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "payday" TIMESTAMPTZ NOT NULL,
    "salary" INTEGER NOT NULL,
    "companyId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "TSalary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TTax" (
    "id" UUID NOT NULL,
    "sort" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "healthInsuranceExpense" INTEGER,
    "employeePensionInsuranceExpense" INTEGER,
    "nationalPensionInsuranceExpense" INTEGER,
    "employeeInsuranceExpense" INTEGER,
    "longTermCareInsurance" INTEGER,
    "incomeTax" INTEGER,
    "residenceTax" INTEGER,
    "yearEndAdjustment" INTEGER,
    "notes" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "TTax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TBonus" (
    "id" UUID NOT NULL,
    "sort" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "payday" TIMESTAMPTZ,
    "bonusAmount" INTEGER,
    "companyId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "TBonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TTaxBonus" (
    "id" UUID NOT NULL,
    "sort" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "healthInsuranceExpense" INTEGER,
    "employeePensionInsuranceExpense" INTEGER,
    "nationalPensionInsuranceExpense" INTEGER,
    "employeeInsuranceExpense" INTEGER,
    "longTermCareInsurance" INTEGER,
    "incomeTax" INTEGER,
    "residenceTax" INTEGER,
    "yearEndAdjustment" INTEGER,
    "notes" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "TTaxBonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCategory" (
    "id" UUID NOT NULL,
    "sort" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "categoryName" VARCHAR(250) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "MCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCompany" (
    "id" UUID NOT NULL,
    "sort" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "name" VARCHAR(250) NOT NULL,
    "majorSector" VARCHAR(250) NOT NULL,
    "subSector" VARCHAR(250),
    "industry" VARCHAR(250),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "MCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MHireDate" (
    "id" UUID NOT NULL,
    "sort" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "hireDate" TIMESTAMPTZ NOT NULL,
    "retirementDate" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "MHireDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_userID_key" ON "User"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TMonthlySpending_id_key" ON "TMonthlySpending"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TSalary_id_key" ON "TSalary"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TTax_id_key" ON "TTax"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TBonus_id_key" ON "TBonus"("id");

-- CreateIndex
CREATE UNIQUE INDEX "TTaxBonus_id_key" ON "TTaxBonus"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MCategory_id_key" ON "MCategory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MCompany_id_key" ON "MCompany"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MHireDate_id_key" ON "MHireDate"("id");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TMonthlySpending" ADD CONSTRAINT "TMonthlySpending_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TMonthlySpending" ADD CONSTRAINT "TMonthlySpending_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TSalary" ADD CONSTRAINT "TSalary_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "MCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TSalary" ADD CONSTRAINT "TSalary_id_fkey" FOREIGN KEY ("id") REFERENCES "TTax"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TSalary" ADD CONSTRAINT "TSalary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TTax" ADD CONSTRAINT "TTax_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "MCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TTax" ADD CONSTRAINT "TTax_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBonus" ADD CONSTRAINT "TBonus_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "MCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBonus" ADD CONSTRAINT "TBonus_id_fkey" FOREIGN KEY ("id") REFERENCES "TTaxBonus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBonus" ADD CONSTRAINT "TBonus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TTaxBonus" ADD CONSTRAINT "TTaxBonus_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "MCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TTaxBonus" ADD CONSTRAINT "TTaxBonus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCategory" ADD CONSTRAINT "MCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MCompany" ADD CONSTRAINT "MCompany_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MHireDate" ADD CONSTRAINT "MHireDate_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "MCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MHireDate" ADD CONSTRAINT "MHireDate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
