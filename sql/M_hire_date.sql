CREATE TABLE IF NOT EXISTS public."M_hire_date"
(
    id integer NOT NULL DEFAULT nextval('"M_hire_date_id_seq"'::regclass),
    user_id integer NOT NULL,
    company_id integer NOT NULL,
    hire_date date NOT NULL,
    retirement_date date,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "M_hire_date_pkey" PRIMARY KEY (id),
    CONSTRAINT fk_company_id FOREIGN KEY (company_id)
        REFERENCES public."M_company" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."M_hire_date"
    OWNER to postgres;

COMMENT ON COLUMN public."M_hire_date".hire_date
    IS '入社日';

COMMENT ON COLUMN public."M_hire_date".retirement_date
    IS '退職日';

-- Trigger: trigger_update_updatedat

-- DROP TRIGGER IF EXISTS trigger_update_updatedat ON public."M_hire_date";

CREATE OR REPLACE TRIGGER trigger_update_updatedat
    BEFORE UPDATE 
    ON public."M_hire_date"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updatedat();