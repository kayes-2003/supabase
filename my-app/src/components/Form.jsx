import { useActionState } from "react";
import supabase from "../supabase-client";

function Form({ metrics, onAdd }) {
    const [error, submitAction, isPending] = useActionState(
        async (previousState, formData) => {
            const newDeal = {
                name: formData.get('name'),
                value: Number(formData.get('value')),
            };

            const { error } = await supabase
                .from('Sales_deals')
                .insert([newDeal]);

            if (error) {
                console.error("Error Adding Deal: ", error.message);
                return error.message;
            }

            // ✅ Pass the new deal back so Dashboard can update chart instantly
            onAdd?.(newDeal);
            return null;
        },
        null
    );

    const generateOptions = () => {
        return metrics.map((metric) => (
            <option key={metric.name} value={metric.name}>
                {metric.name}
            </option>
        ));
    };

    return (
        <div className="add-form-container">
            {error && <p className="error-message">{error}</p>}

            <form action={submitAction} aria-label="Add new sales deal">

                <label htmlFor="deal-name">
                    Name:
                    <select
                        name="name"
                        id="deal-name"
                        defaultValue={metrics?.[0]?.name || ''}
                        aria-required="true"
                        aria-invalid={error ? 'true' : 'false'}
                        disabled={isPending}
                    >
                        {generateOptions()}
                    </select>
                </label>

                <label htmlFor="deal-value">
                    Amount: $
                    <input
                        type="number"
                        id="deal-value"
                        name="value"
                        defaultValue={0}
                        className="amount-input"
                        min="0"
                        step="10"
                        aria-required="true"
                        aria-label="Deal amount in dollars"
                        disabled={isPending}
                    />
                </label>

                <button type="submit" disabled={isPending} aria-busy={isPending}>
                    {isPending ? 'Adding...' : 'Add Deal'}
                </button>

            </form>
        </div>
    );
}

export default Form;