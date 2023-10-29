CREATE TABLE IF NOT EXISTS public."T_bonus"
(
    id serial NOT NULL,
    user_id integer NOT NULL,
    payday date,
    bonus_amount integer,
    company_id integer,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "T_bonus_pkey" PRIMARY KEY (id),
    CONSTRAINT fk_company_id FOREIGN KEY (company_id)
        REFERENCES public."M_company" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT fk_id FOREIGN KEY (id)
        REFERENCES public."T_tax_bonus" (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."T_bonus"
    OWNER to postgres;

COMMENT ON COLUMN public."T_bonus".payday IS '支給日';
COMMENT ON COLUMN public."T_bonus".bonus_amount IS '賞与';

-- Trigger: trigger_update_updatedat
-- DROP TRIGGER IF EXISTS trigger_update_updatedat ON public."T_bonus";
CREATE OR REPLACE TRIGGER trigger_update_updatedat
    BEFORE UPDATE ON public."T_bonus"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updatedat();
