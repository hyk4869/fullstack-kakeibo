CREATE TABLE IF NOT EXISTS public."T_salary"
(
    id serial NOT NULL,
    user_id integer NOT NULL,
    payday date NOT NULL,
    salary integer NOT NULL,
    company_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "T_salary_pkey" PRIMARY KEY (id),
    CONSTRAINT fk_company_id FOREIGN KEY (company_id)
        REFERENCES public."M_company" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_id FOREIGN KEY (id)
        REFERENCES public."T_tax" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."T_salary"
    OWNER to postgres;

COMMENT ON COLUMN public."T_salary".payday
    IS '給料日';

COMMENT ON COLUMN public."T_salary".salary
    IS '総支給額';

-- Trigger: trigger_update_updatedat

-- DROP TRIGGER IF EXISTS trigger_update_updatedat ON public."T_salary";

CREATE OR REPLACE TRIGGER trigger_update_updatedat
    BEFORE UPDATE 
    ON public."T_salary"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updatedat();
