import { useActionState } from "react";

export default function Submit() {
  const { pending } = useActionState();

  return (
    <p className="actions">
      <button type="submit" disabled={pending}>
        {pending ? 'Submitting...' : 'Submit'}
      </button>
    </p>
  );
}
