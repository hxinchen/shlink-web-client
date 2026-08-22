/* oxlint-disable react(react-compiler) */
import { faCopy, faKey, faPlus, faTrash, faBan, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Card, LabelledInput, LabelledSelect } from '@shlinkio/shlink-frontend-kit';
import type { FC, FormEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useTranslation } from '../i18n/useTranslation';
import { NoMenuLayout } from '../common/NoMenuLayout';

type ApiKey = { name: string; enabled: boolean; expirationDate: string | null; roles: string[] };
type CreateForm = { name: string; expirationDate: string; role: string; domain: string };
const emptyForm: CreateForm = { name: '', expirationDate: '', role: 'admin', domain: '' };

const api = async (path: string, options: RequestInit = {}) => {
  const headers = new Headers(options.headers);
  headers.set('content-type', 'application/json');
  const response = await fetch(new URL(`/admin-api${path}`, window.location.origin), { ...options, headers });
  if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error ?? `HTTP ${response.status}`);
  return response.status === 204 ? null : response.json();
};

export const ApiKeysPage: FC = () => {
  const { t } = useTranslation();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [form, setForm] = useState<CreateForm>(emptyForm);
  const [newKey, setNewKey] = useState<{ name: string; apiKey: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<string | null>(null);

  const load = useCallback(async () => { setLoading(true); try { setKeys((await api('/api-keys')).items); setError(''); } catch (e) { setError(e instanceof Error ? e.message : t('Request failed')); } finally { setLoading(false); } }, [t]);
  useEffect(() => { void Promise.resolve().then(load); }, [load]);
  const create = async (event: FormEvent) => {
    event.preventDefault(); setError('');
    try { const input = { name: form.name.trim(), ...(form.expirationDate && { expirationDate: form.expirationDate }), ...(form.role === 'author' && { authorOnly: true }), ...(form.role === 'domain' && { domainOnly: form.domain.trim() }), ...(form.role === 'no-orphan' && { noOrphanVisits: true }) }; setNewKey(await api('/api-keys', { method: 'POST', body: JSON.stringify(input) })); setForm(emptyForm); await load(); } catch (e) { setError(e instanceof Error ? e.message : t('Request failed')); }
  };
  const disable = async (name: string) => { if (!window.confirm(t('Disable this API key?'))) return; await api(`/api-keys/${encodeURIComponent(name)}`, { method: 'PATCH', body: JSON.stringify({ enabled: false }) }); await load(); };
  const remove = async (name: string) => { if (!window.confirm(t('Delete this API key?'))) return; await api(`/api-keys/${encodeURIComponent(name)}`, { method: 'DELETE' }); await load(); };
  const rename = async (name: string) => { const newName = window.prompt(t('New API key name'), name); if (!newName || newName === name) return; await api(`/api-keys/${encodeURIComponent(name)}`, { method: 'PATCH', body: JSON.stringify({ newName }) }); await load(); };

  return <NoMenuLayout>
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><Link to="/settings" className="text-sm text-lm-brand hover:underline">← {t('Settings')}</Link><h1 className="mt-2 text-3xl font-semibold tracking-tight">{t('API keys')}</h1><p className="mt-1 text-sm opacity-70">{t('Create and manage keys used by your integrations.')}</p></div>
        <a className="inline-flex items-center gap-2 rounded-md border border-black/10 px-3 py-2 text-sm hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10" href="/admin-api/docs.html" target="_blank" rel="noreferrer"><FontAwesomeIcon icon={faKey} /> {t('API documentation')}</a>
      </div>
      <Card className="p-5"><h2 className="text-lg font-semibold">{t('Create API key')}</h2><form onSubmit={create} className="mt-4 grid gap-4 md:grid-cols-4">
        <LabelledInput required label={t('Name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="friend-alice" />
        <LabelledInput label={t('Expiration date')} type="date" value={form.expirationDate} onChange={(e) => setForm({ ...form, expirationDate: e.target.value })} />
        <LabelledSelect label={t('Role')} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="admin">{t('Admin')}</option><option value="author">{t('Own short URLs only')}</option><option value="domain">{t('Specific domain')}</option><option value="no-orphan">{t('Hide orphan visits')}</option></LabelledSelect>
        {form.role === 'domain' ? <LabelledInput required label={t('Domain')} value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="quarks.click" /> : <div className="hidden md:block" />}
        <div className="md:col-span-4"><Button type="submit" disabled={!form.name.trim()}><FontAwesomeIcon icon={faPlus} /> {t('Create key')}</Button></div>
      </form></Card>
      {newKey && <Card className="border-lm-brand bg-lm-brand/10 p-5"><h2 className="font-semibold">{t('Key created')}</h2><p className="mt-1 text-sm">{t('Copy it now. The full key is shown only once.')}</p><div className="mt-3 flex gap-2"><code className="min-w-0 flex-1 break-all rounded bg-black/10 p-3 text-sm dark:bg-white/10">{newKey.apiKey}</code><Button aria-label={t('Copy')} onClick={() => void navigator.clipboard.writeText(newKey.apiKey)}><FontAwesomeIcon icon={faCopy} /></Button></div><Button className="mt-3" onClick={() => setNewKey(null)}>{t('Done')}</Button></Card>}
      {error && <div role="alert" className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-300">{error}</div>}
      <Card className="overflow-hidden"><div className="flex items-center justify-between border-b border-black/10 p-5 dark:border-white/10"><h2 className="text-lg font-semibold">{t('Configured keys')}</h2><Button size="sm" onClick={() => void load()} disabled={loading}>{t('Refresh')}</Button></div>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-black/5 text-xs uppercase tracking-wide opacity-70 dark:bg-white/5"><tr><th className="px-5 py-3">{t('Name')}</th><th className="px-5 py-3">{t('Status')}</th><th className="px-5 py-3">{t('Expiration date')}</th><th className="px-5 py-3">{t('Role')}</th><th className="px-5 py-3 text-right">{t('Actions')}</th></tr></thead><tbody>{keys.map((key) => <tr key={key.name} className="border-t border-black/10 hover:bg-black/[.03] dark:border-white/10 dark:hover:bg-white/[.03]"><td className="px-5 py-4 font-medium">{editing === key.name ? <LabelledInput label={t('New API key name')} defaultValue={key.name} onKeyDown={(e) => { if (e.key === 'Enter') { void rename(key.name); setEditing(null); } }} /> : key.name}</td><td className="px-5 py-4"><span className={key.enabled ? 'text-emerald-600' : 'text-red-600'}>{key.enabled ? t('Enabled') : t('Disabled')}</span></td><td className="px-5 py-4">{key.expirationDate ?? t('Never')}</td><td className="px-5 py-4">{key.roles.join(', ')}</td><td className="px-5 py-4 text-right"><div className="flex justify-end gap-2"><Button size="sm" aria-label={t('Rename')} onClick={() => setEditing(editing === key.name ? null : key.name)}><FontAwesomeIcon icon={faPen} /></Button>{key.enabled && <Button size="sm" aria-label={t('Disable')} onClick={() => void disable(key.name)}><FontAwesomeIcon icon={faBan} /></Button>}<Button size="sm" aria-label={t('Delete')} onClick={() => void remove(key.name)}><FontAwesomeIcon icon={faTrash} /></Button></div></td></tr>)}{!loading && keys.length === 0 && <tr><td colSpan={5} className="p-10 text-center opacity-60">{t('No API keys found.')}</td></tr>}</tbody></table></div>
      </Card>
    </div>
  </NoMenuLayout>;
};
