CREATE TABLE IF NOT EXISTS public."T_tax_bonus"
(
    id serial NOT NULL,
    user_id integer NOT NULL,
    company_id integer,
    health_insurance_expense integer,
    employee_pension_insurance_expense integer,
    national_pension_insurance_expense integer,
    employee_insurance_expense integer,
    long_term_care_insurance integer,
    income_tax integer,
    residence_tax integer,
    year_end_adjustment character varying(250) COLLATE pg_catalog."default",
    notes character varying(250) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "T_tax_bonus_pkey" PRIMARY KEY (id),
    CONSTRAINT fk_company_id FOREIGN KEY (company_id)
        REFERENCES public."M_company" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."T_tax_bonus"
    OWNER to postgres;

COMMENT ON COLUMN public."T_tax_bonus".health_insurance_expense IS '健康保険料';
COMMENT ON COLUMN public."T_tax_bonus".employee_pension_insurance_expense IS '厚生年金保険料';
COMMENT ON COLUMN public."T_tax_bonus".national_pension_insurance_expense IS '国民年金保険料';
COMMENT ON COLUMN public."T_tax_bonus".employee_insurance_expense IS '雇用保険料';
COMMENT ON COLUMN public."T_tax_bonus".long_term_care_insurance IS '介護保険料';
COMMENT ON COLUMN public."T_tax_bonus".income_tax IS '所得税';
COMMENT ON COLUMN public."T_tax_bonus".residence_tax IS '住民税';
COMMENT ON COLUMN public."T_tax_bonus".year_end_adjustment IS '年末調整';
COMMENT ON COLUMN public."T_tax_bonus".notes IS 'その他控除';

-- Trigger: trigger_update_updatedat

-- DROP TRIGGER IF EXISTS trigger_update_updatedat ON public."T_tax_bonus";

CREATE OR REPLACE TRIGGER trigger_update_updatedat
    BEFORE UPDATE ON public."T_tax_bonus"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updatedat();
