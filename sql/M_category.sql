CREATE TABLE IF NOT EXISTS public."M_category"
(
    category_id serial NOT NULL,
    user_id integer NOT NULL,
    category_name character varying(50) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT spending_category_pkey PRIMARY KEY (category_id)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."M_category"
    OWNER to postgres;

COMMENT ON COLUMN public."M_category".category_id IS 'カテゴリーID';
COMMENT ON COLUMN public."M_category".category_name IS 'カテゴリー名';

-- Trigger: trigger_update_updatedat
-- DROP TRIGGER IF EXISTS trigger_update_updatedat ON public."M_category";
CREATE OR REPLACE TRIGGER trigger_update_updatedat
    BEFORE UPDATE ON public."M_category"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updatedat();

-- Trigger: update_updatedat_trigger
-- DROP TRIGGER IF EXISTS update_updatedat_trigger ON public."M_category";
CREATE OR REPLACE TRIGGER update_updatedat_trigger
    BEFORE UPDATE ON public."M_category"
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updatedat();
