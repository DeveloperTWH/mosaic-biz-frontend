type AuthFormSectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

/** Groups related fields to reduce “wall of fields” feeling on signup and long forms. */
export default function AuthFormSection({ title, description, children }: AuthFormSectionProps) {
  return (
    <section className="auth-form-section">
      <div className="auth-form-section-header">
        <h3 className="auth-form-section-title">{title}</h3>
        {description ? <p className="auth-form-section-desc">{description}</p> : null}
      </div>
      <div className="auth-form-section-body">{children}</div>
    </section>
  );
}
