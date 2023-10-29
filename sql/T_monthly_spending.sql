CREATE TABLE IF NOT EXISTS public."T_monthly_spending"
(
    id serial NOT NULL,
    user_id integer NOT NULL,
    payment_day date NOT NULL,
    store character varying(70) COLLATE pg_catalog."default" NOT NULL,
    category integer NOT NULL,
    usage_fee integer NOT NULL,
    notes character varying(250) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "T_monthly_spending_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."T_monthly_spending"
    OWNER to postgres;

-- Trigger: trigger_update_updatedat

-- DROP TRIGGER IF EXISTS trigger_update_updatedat ON public."T_monthly_spending";

CREATE OR REPLACE TRIGGER trigger_update_updatedat
    BEFORE UPDATE 
    ON public."T_monthly_spending"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updatedat();
