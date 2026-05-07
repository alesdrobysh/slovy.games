export default function RulesComponent({
  inline = false,
}: {
  inline?: boolean;
}) {
  if (inline) {
    return (
      <div className="border-2 border-dashed border-[var(--border)] rounded-2xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--rank-10)] text-white text-3xl font-bold flex items-center justify-center mx-auto">
          ?
        </div>
        <h2 className="font-serif text-2xl font-bold text-[var(--text)] mt-4">
          Адгадайце слова дня
        </h2>
        <p className="text-sm text-[var(--text-muted)] max-w-xs mx-auto mt-2">
          Знайдзіце загаданае слова па яго сэнсе. Чым меншы нумар, тым бліжэй вы
          да адгадкі.
        </p>
        <div className="flex justify-center gap-3 flex-wrap pt-3">
          <div className="flex flex-col items-center gap-1">
            <span
              className="w-8 h-2 rounded-full"
              style={{ backgroundColor: "var(--rank-1)" }}
              aria-hidden="true"
            />
            <span className="text-xs text-[var(--text-muted)]">
              Перамога №1
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span
              className="w-8 h-2 rounded-full"
              style={{ backgroundColor: "var(--rank-10)" }}
              aria-hidden="true"
            />
            <span className="text-xs text-[var(--text-muted)]">
              Вельмі блізка 2–10
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span
              className="w-8 h-2 rounded-full"
              style={{ backgroundColor: "var(--rank-100)" }}
              aria-hidden="true"
            />
            <span className="text-xs text-[var(--text-muted)]">
              Блізка 11–100
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span
              className="w-8 h-2 rounded-full"
              style={{ backgroundColor: "var(--rank-1000)" }}
              aria-hidden="true"
            />
            <span className="text-xs text-[var(--text-muted)]">
              Трохі далей 101–1000
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span
              className="w-8 h-2 rounded-full"
              style={{ backgroundColor: "var(--rank-default)" }}
              aria-hidden="true"
            />
            <span className="text-xs text-[var(--text-muted)]">
              Вельмі далёка 1001+
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-sm text-[var(--text)]">
      <p>
        Знайдзіце загаданае слова па яго <strong>сэнсе</strong>, а не па
        напісанні.
      </p>
      <p>
        Напрыклад, загадана слова:{" "}
        <strong className="text-[var(--accent)]">ЛЕС</strong>
      </p>

      <ul className="space-y-2 mt-3">
        <li className="flex items-start gap-3">
          <span
            className="shrink-0 w-3 h-3 rounded-sm mt-0.5"
            style={{ backgroundColor: "var(--rank-1)" }}
            aria-hidden="true"
          />
          <span>
            Лес — <strong>перамога</strong> (№1)
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span
            className="shrink-0 w-3 h-3 rounded-sm mt-0.5"
            style={{ backgroundColor: "var(--rank-10)" }}
            aria-hidden="true"
          />
          <span>
            Дрэва — <strong>вельмі блізка</strong> (№4)
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span
            className="shrink-0 w-3 h-3 rounded-sm mt-0.5"
            style={{ backgroundColor: "var(--rank-100)" }}
            aria-hidden="true"
          />
          <span>
            Птушка — <strong>блізка</strong> (№45)
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span
            className="shrink-0 w-3 h-3 rounded-sm mt-0.5"
            style={{ backgroundColor: "var(--rank-1000)" }}
            aria-hidden="true"
          />
          <span>
            Грыб — <strong>трохі далей</strong> (№215)
          </span>
        </li>
        <li className="flex items-start gap-3">
          <span
            className="shrink-0 w-3 h-3 rounded-sm mt-0.5"
            style={{ backgroundColor: "var(--rank-default)" }}
            aria-hidden="true"
          />
          <span>
            Аўтамабіль — <strong>вельмі далёка</strong> (№15000)
          </span>
        </li>
      </ul>

      <p className="pt-1">Чым меншы нумар, тым бліжэй вы да адгадкі.</p>
      <p>
        Слова пад нумарам <strong>1</strong> — гэта перамога!
      </p>
      <p>
        Калі захраснеце — бярыце <strong>падказку</strong>.
      </p>
      <p className="text-[var(--text-muted)]">
        Націсніце на любое слова ў спісе, каб убачыць яго ў слоўніку.
      </p>
    </div>
  );
}
