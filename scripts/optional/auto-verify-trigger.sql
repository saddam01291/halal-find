-- ============================================
-- AUTO COMMUNITY CERTIFICATION TRIGGER
-- ============================================
-- Automatically upgrades an unverified place to "community_verified"
-- when it receives 5 positive halal confirmations.

CREATE OR REPLACE FUNCTION public.check_and_auto_verify_place()
RETURNS TRIGGER AS $$
DECLARE
    v_verification_status text;
    v_positive_count int;
BEGIN
    -- Only proceed if this is a new review and it confirms halal status
    IF NEW.is_halal_confirmed = TRUE THEN
        -- Get current status of the place
        SELECT verification_status INTO v_verification_status
        FROM places
        WHERE id = NEW.place_id;

        -- Check if it's eligible for auto-upgrade (currently unverified or caution)
        IF v_verification_status = 'unverified' OR v_verification_status = 'caution' THEN
            -- Count how many positive confirmations this place has
            SELECT COUNT(*) INTO v_positive_count
            FROM reviews
            WHERE place_id = NEW.place_id
              AND is_halal_confirmed = TRUE;

            -- If it has 5 or more positive confirmations, upgrade it
            IF v_positive_count >= 5 THEN
                UPDATE places
                SET 
                    verification_status = 'community_verified',
                    verified = true,
                    halal_status = 'halal'
                WHERE id = NEW.place_id;
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on the reviews table
DROP TRIGGER IF EXISTS trg_auto_verify_place ON reviews;
CREATE TRIGGER trg_auto_verify_place
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION public.check_and_auto_verify_place();
