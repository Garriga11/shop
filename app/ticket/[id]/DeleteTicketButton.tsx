'use client';

interface DeleteTicketButtonProps {
  onDelete: () => void;
}

export default function DeleteTicketButton({ onDelete }: DeleteTicketButtonProps) {
  const handleClick = (e: React.FormEvent) => {
    if (!confirm('Are you sure you want to delete this ticket? This action cannot be undone.')) {
      e.preventDefault();
      return;
    }
    // If confirmed, let the form submit naturally
  };

  return (
    <button 
      type="submit" 
      className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      onClick={handleClick}
    >
      Delete Ticket
    </button>
  );
}