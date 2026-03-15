'use client';

import { useAdmin } from '@/contexts/AdminContext';

const MESSAGES_PAGE_SIZE = 15;

export default function AdminMessagesPage() {
  const {
    messageFilter,
    setMessageFilter,
    messageSearch,
    setMessageSearch,
    messagePage,
    setMessagePage,
    paginatedMessages,
    totalMessagePages,
    safeMessagePage,
    filteredMessages,
    messages,
    handleMarkMessageRead,
  } = useAdmin();

  return (
    <div className="space-y-8">
      <h1 className="admin-page-title">
        Messages from Contact
      </h1>
      <p className="admin-muted">
        Inquiries sent from the Contact page. Click a message to mark it as read.
      </p>

      {messages.length === 0 ? (
        <section className="admin-grit p-8 text-center">
          <p className="admin-muted">No messages yet.</p>
        </section>
      ) : (
        <section className="admin-grit p-6">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="admin-grit-inner flex rounded-lg bg-neutral-800/50 p-1">
              {(['all', 'unread', 'read'] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => {
                    setMessageFilter(f);
                    setMessagePage(1);
                  }}
                  className={`admin-body rounded-md px-3 py-1.5 font-medium capitalize transition-colors ${
                    messageFilter === f ? 'bg-brand-yellow text-neutral-900' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <input
              type="search"
              value={messageSearch}
              onChange={(e) => {
                setMessageSearch(e.target.value);
                setMessagePage(1);
              }}
              placeholder="Search by name, phone, or message…"
              className="admin-body min-w-[200px] flex-1 rounded-lg border border-neutral-600 bg-neutral-800 px-3 py-2 text-neutral-100 placeholder-neutral-500 focus:border-brand-yellow focus:outline-none focus:ring-1 focus:ring-brand-yellow"
            />
          </div>
          <p className="admin-small mb-3">
            Showing{' '}
            {filteredMessages.length === 0
              ? 0
              : (safeMessagePage - 1) * MESSAGES_PAGE_SIZE + 1}
            –{Math.min(safeMessagePage * MESSAGES_PAGE_SIZE, filteredMessages.length)} of{' '}
            {filteredMessages.length}
            {filteredMessages.length < messages.length &&
              ` (filtered from ${messages.length})`}
          </p>
          <ul className="space-y-3">
            {paginatedMessages.map((msg) => (
              <li
                key={msg.id}
                className={`admin-grit-inner rounded-lg p-4 transition-colors ${
                  msg.read
                    ? 'bg-neutral-800/30 opacity-75'
                    : 'bg-neutral-800/50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleMarkMessageRead(msg.id)}
                  className="-m-1 w-full rounded-lg p-1 text-left focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:ring-inset focus:ring-offset-0"
                >
                  <div className="admin-body flex flex-wrap items-center gap-2">
                    <a
                      href={`tel:${msg.phone}`}
                      className="font-semibold text-brand-yellow hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {msg.phone}
                    </a>
                    {msg.name !== '—' && <span className="text-neutral-400">{msg.name}</span>}
                    <span className="text-neutral-500">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                    {msg.read && (
                      <span className="admin-small ml-auto rounded bg-neutral-600 px-2 py-0.5 text-neutral-300">
                        Read
                      </span>
                    )}
                  </div>
                  {msg.message !== '—' && (
                    <p className="mt-2 text-neutral-300">{msg.message}</p>
                  )}
                </button>
              </li>
            ))}
          </ul>
          {totalMessagePages > 1 && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-700 pt-4">
              <button
                type="button"
                onClick={() => setMessagePage((p) => Math.max(1, p - 1))}
                disabled={safeMessagePage <= 1}
                className="admin-body rounded-lg border border-neutral-600 bg-neutral-800 px-4 py-2 font-medium text-neutral-300 transition-colors hover:bg-neutral-700 disabled:pointer-events-none disabled:opacity-40"
              >
                Previous
              </button>
              <span className="admin-muted">
                Page {safeMessagePage} of {totalMessagePages}
              </span>
              <button
                type="button"
                onClick={() => setMessagePage((p) => Math.min(totalMessagePages, p + 1))}
                disabled={safeMessagePage >= totalMessagePages}
                className="admin-body rounded-lg border border-neutral-600 bg-neutral-800 px-4 py-2 font-medium text-neutral-300 transition-colors hover:bg-neutral-700 disabled:pointer-events-none disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
