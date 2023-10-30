-- CreateTable
CREATE TABLE "TMonthlySpending" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "paymentDay" TIMESTAMP(3) NOT NULL,
    "store" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "usageFee" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TMonthlySpending_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TSalary" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "payday" TIMESTAMP(3) NOT NULL,
    "salary" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TSalary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TTax" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER,
    "healthInsuranceExpense" INTEGER,
    "employeePensionInsuranceExpense" INTEGER,
    "nationalPensionInsuranceExpense" INTEGER,
    "employeeInsuranceExpense" INTEGER,
    "longTermCareInsurance" INTEGER,
    "incomeTax" INTEGER,
    "residenceTax" INTEGER,
    "yearEndAdjustment" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TTax_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TBonus" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "payday" TIMESTAMP(3),
    "bonusAmount" INTEGER,
    "companyId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TBonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TTaxBonus" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "companyId" INTEGER,
    "healthInsuranceExpense" INTEGER,
    "employeePensionInsuranceExpense" INTEGER,
    "nationalPensionInsuranceExpense" INTEGER,
    "employeeInsuranceExpense" INTEGER,
    "longTermCareInsurance" INTEGER,
    "incomeTax" INTEGER,
    "residenceTax" INTEGER,
    "yearEndAdjustment" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TTaxBonus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MCategory" (
    "categoryId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "categoryName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MCategory_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "MCompany" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "major_sector" TEXT NOT NULL,
    "subsector" TEXT,
    "industry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mhire_date" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "hire_date" TIMESTAMP(3) NOT NULL,
    "retirement_date" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mhire_date_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TMonthlySpending" ADD CONSTRAINT "TMonthlySpending_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "MCategory"("categoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TSalary" ADD CONSTRAINT "TSalary_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "MCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TSalary" ADD CONSTRAINT "TSalary_id_fkey" FOREIGN KEY ("id") REFERENCES "TTax"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TTax" ADD CONSTRAINT "TTax_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "MCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBonus" ADD CONSTRAINT "TBonus_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "MCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TBonus" ADD CONSTRAINT "TBonus_id_fkey" FOREIGN KEY ("id") REFERENCES "TTaxBonus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TTaxBonus" ADD CONSTRAINT "TTaxBonus_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "MCompany"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mhire_date" ADD CONSTRAINT "Mhire_date_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "MCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
