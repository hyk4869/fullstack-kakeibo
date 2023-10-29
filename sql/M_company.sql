-- Table: public.M_company

-- DROP TABLE IF EXISTS public."M_company";

CREATE TABLE IF NOT EXISTS public."M_company"
(
    id integer NOT NULL DEFAULT nextval('"M_company_id_seq"'::regclass),
    user_id integer NOT NULL,
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    major_sector character varying(70) COLLATE pg_catalog."default" NOT NULL,
    subsector character varying(50) COLLATE pg_catalog."default",
    industry character varying(50) COLLATE pg_catalog."default",
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT "M_company_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."M_company"
    OWNER to postgres;

COMMENT ON COLUMN public."M_company".name
    IS '会社名';

COMMENT ON COLUMN public."M_company".major_sector
    IS '大分類';

COMMENT ON COLUMN public."M_company".subsector
    IS '中分類';

COMMENT ON COLUMN public."M_company".industry
    IS '小分類';

-- Trigger: trigger_update_updatedat

-- DROP TRIGGER IF EXISTS trigger_update_updatedat ON public."M_company";

CREATE OR REPLACE TRIGGER trigger_update_updatedat
    BEFORE UPDATE 
    ON public."M_company"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updatedat();