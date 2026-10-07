"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useMemo, useState } from "react";

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

type SortOrder = "newest" | "oldest";

export default function AdminPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [contacts, setContacts] = useState<Contact[]>([]);

  const [authenticated, setAuthenticated] = useState(false);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const credentials = btoa(`${username}:${password}`);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/contacts`,
        {
          headers: {
            Authorization: `Basic ${credentials}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Usuario o contraseña incorrectos");
      }

      const data = await response.json();

      setContacts(data.contacts);
      setAuthenticated(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error de autenticación",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setContacts([]);
    setUsername("");
    setPassword("");
    setSearch("");
    setSortOrder("newest");

    router.push("/");
  };

  const filteredContacts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();

    return contacts
      .filter((contact) => {
        if (!normalizedSearch) {
          return true;
        }

        return (
          contact.name.toLocaleLowerCase().includes(normalizedSearch) ||
          contact.email.toLocaleLowerCase().includes(normalizedSearch)
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at.replace(" ", "T") + "Z").getTime();

        const dateB = new Date(b.created_at.replace(" ", "T") + "Z").getTime();

        if (dateA === dateB) {
          return sortOrder === "newest" ? b.id - a.id : a.id - b.id;
        }

        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });
  }, [contacts, search, sortOrder]);

  if (!authenticated) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <Link
          href="/"
          className="absolute top-5 right-10 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition duration-300 hover:bg-black hover:text-white"
        >
          Volver al formulario
        </Link>
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-5 rounded-2xl bg-white p-8 shadow"
        >
          <h1 className="text-2xl font-bold">Admin</h1>

          <p className="mt-1 text-sm text-gray-500">
            Ingresa tus credenciales para consultar los contactos.
          </p>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Usuario"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Contraseña"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-lg bg-black p-3 text-white disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Contactos</h1>

            <p className="mt-1 text-gray-500">
              {contacts.length} contactos registrados
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-200"
            >
              Formulario
            </Link>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white cursor-pointer transition hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="mb-6 flex gap-4">
          <div className="flex-1">
            <label
              htmlFor="search"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Buscar contacto
            </label>

            <input
              id="search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre o correo..."
              className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-black"
            />
          </div>

          <div className="md:w-64">
            <label
              htmlFor="sort"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Ordenar por
            </label>

            <select
              id="sort"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(event.target.value as SortOrder)
              }
              className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-black"
            >
              <option value="newest">Más recientes primero</option>

              <option value="oldest">Más antiguos primero</option>
            </select>
          </div>
        </section>

        <p className="mb-4 text-sm text-gray-500">
          Mostrando {filteredContacts.length} de {contacts.length} contactos
        </p>

        <div className="space-y-4">
          {filteredContacts.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm">
              <p className="font-medium text-gray-700">
                No se encontraron contactos
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Prueba utilizando otro nombre o correo.
              </p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <article
                key={contact.id}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <h2 className="font-semibold">{contact.name}</h2>

                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm text-gray-500"
                    >
                      {contact.email}
                    </a>
                  </div>

                  <time className="text-sm text-gray-400">
                    {new Date(
                      contact.created_at.replace(" ", "T") + "Z",
                    ).toLocaleString()}
                  </time>
                </div>

                <p className="mt-4 text-gray-700">{contact.message}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
