# Complete XML Tag Reference for Prompting

> Based on KERNEL Framework, Anthropic's Official Documentation, and Hostinger Best Practices

---

## Tag Priority Hierarchy

| Priority | Tag | Status | Impact |
|----------|-----|--------|--------|
| 1 | `<task>` | **REQUIRED** | The core — without this, nothing else matters |
| 2 | `<constraints>` | Recommended | 91% reduction in unwanted outputs (KERNEL data) |
| 3 | `<format>` | Recommended | Controls structure and parseability |
| 4 | `<context>` | Optional | Provides necessary background |
| 5 | `<role>` | Optional | Sets expertise and tone |
| 6 | `<examples>` | Optional | 3-5 examples dramatically improve accuracy |
| 7 | `<success_criteria>` | Optional | 85% vs 41% success rate (KERNEL data) |
| 8 | `<input>` | As needed | The data to process |

---

## Detailed Tag Descriptions

### 1. `<task>` — REQUIRED

**What it does:** Defines the ONE specific goal Claude should accomplish.

**Why it matters:** KERNEL's "Narrow scope" principle showed single-goal prompts had **89% satisfaction vs 41%** for multi-goal prompts.

**Rules:**

- One task per prompt
- Be specific and actionable
- Start with a verb (Review, Write, Analyze, Create, Debug)

```xml
<!-- ❌ BAD: Multiple goals -->
<task>
Review this code, write documentation, and create tests.
</task>

<!-- ✅ GOOD: Single, specific goal -->
<task>
Review the provided Python function for SQL injection
vulnerabilities and suggest parameterized query fixes.
</task>
```

---

### 2. `<constraints>` — RECOMMENDED

**What it does:** Sets boundaries, limitations, and preferences.

**Why it matters:** KERNEL found explicit constraints **reduced unwanted outputs by 91%**.

**Anthropic's key insight:** Tell Claude what TO DO, not what NOT to do.

```xml
<!-- ❌ LESS EFFECTIVE: Negative framing -->
<constraints>
Don't use external libraries.
Don't write functions longer than 20 lines.
Don't include comments.
</constraints>

<!-- ✅ MORE EFFECTIVE: Positive framing -->
<constraints>
- Use only Python standard library
- Keep each function under 20 lines
- Write self-documenting code with clear variable names
- Target Python 3.10+ compatibility
</constraints>
```

---

### 3. `<format>` — RECOMMENDED

**What it does:** Specifies the structure, length, and style of Claude's response.

**Anthropic tip:** "Match your prompt style to desired output style" — if you want prose, write in prose; if you want bullets, use bullets.

```xml
<!-- For structured output -->
<format>
For each issue found:
1. Line number(s) affected
2. Issue description (1-2 sentences)
3. Severity: CRITICAL | HIGH | MEDIUM | LOW
4. Fix: code snippet with correction

End with a markdown table summarizing all issues.
</format>

<!-- For prose output -->
<format>
Write in flowing paragraphs without bullet points or headers.
Keep the total response under 300 words. Use a conversational
but professional tone suitable for a business blog.
</format>
```

---

### 4. `<context>` — OPTIONAL

**What it does:** Provides background information, domain knowledge, or situational details.

**When to use:** When Claude needs to understand the "why" behind the task.

**Anthropic's golden rule:** "Give Claude contextual information" — think of Claude as a brilliant new employee who needs to be briefed.

```xml
<context>
I'm building a healthcare SaaS platform that must comply
with HIPAA regulations. The application handles:
- Patient medical records
- Appointment scheduling
- Prescription management

Tech stack: Python 3.11, FastAPI, PostgreSQL, Redis
Deployment: AWS with HIPAA-compliant infrastructure
Team: 3 developers, launching MVP in 6 weeks
</context>
```

---

### 5. `<role>` — OPTIONAL

**What it does:** Defines who Claude should be — expertise level, perspective, and communication style.

**When to use:**

- Domain-specific tasks requiring expertise
- When you need a particular tone (formal, casual, technical)
- When perspective matters (security expert vs. performance expert)

```xml
<!-- Technical expert role -->
<role>
You are a senior security engineer with 15 years of experience
in penetration testing, OWASP Top 10 vulnerabilities, and
secure code review. You communicate findings clearly to both
technical developers and non-technical executives.
</role>

<!-- Communication-focused role -->
<role>
You are a patient, encouraging programming tutor who specializes
in teaching beginners. You explain concepts using simple analogies
and celebrate small wins. You never make the student feel stupid
for asking questions.
</role>
```

---

### 6. `<examples>` — OPTIONAL but POWERFUL

**What it does:** Shows Claude exactly what good output looks like (few-shot prompting).

**Anthropic data:** "3-5 diverse, relevant examples" dramatically improve accuracy, consistency, and format adherence.

**Key principles:**

- Make examples **relevant** to your actual use case
- Make them **diverse** (cover edge cases, variations)
- Wrap each in `<example>` tags inside `<examples>`

```xml
<examples>
<example>
Input: password = request.GET['pwd']
Output:
  Line: 15
  Issue: Password transmitted via GET parameter (visible in URLs, logs)
  Severity: CRITICAL
  Fix: Use POST method over HTTPS
       password = request.POST.get('pwd')
</example>

<example>
Input: cursor.execute(f"SELECT * FROM users WHERE id={user_id}")
Output:
  Line: 42
  Issue: SQL injection vulnerability via string interpolation
  Severity: CRITICAL
  Fix: Use parameterized queries
       cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
</example>

<example>
Input: print(f"Debug: user data = {user_data}")
Output:
  Line: 78
  Issue: Sensitive data exposed in debug output
  Severity: MEDIUM
  Fix: Remove debug statement or use proper logging with PII filtering
       logger.debug("User action completed", extra={"user_id": user_id})
</example>
</examples>
```

---

### 7. `<success_criteria>` — OPTIONAL

**What it does:** Defines measurable criteria to verify the output is correct.

**KERNEL data:** Prompts with clear success criteria had **85% success rate vs 41%** without.

**Anthropic framework:** Criteria should be **Specific, Measurable, Achievable, Relevant**.

```xml
<success_criteria>
- Every identified issue must reference specific line numbers
- All suggested code fixes must be syntactically valid Python 3.10+
- Severity ratings must align with OWASP risk categories
- Response must include at least 3 issues or explicitly state "No issues found"
- Total response length must be under 800 words
</success_criteria>
```

---

### 8. `<input>` — AS NEEDED

**What it does:** Contains the actual data, code, document, or content to process.

**Anthropic tip for long inputs (20K+ tokens):** Place input at the **TOP** of the prompt, with instructions at the **END**. This improves response quality by up to 30%.

```xml
<!-- For short inputs -->
<input>
def get_user(user_id):
    query = f"SELECT * FROM users WHERE id = {user_id}"
    return db.execute(query).fetchone()
</input>

<!-- For long documents, use the documents structure -->
<documents>
<document index="1">
  <source>security_policy.pdf</source>
  <content>
  ... full document content here ...
  </content>
</document>
</documents>

<!-- Then put your task/instructions AFTER the documents -->
<task>
Analyze the security policy above and identify any gaps
related to data encryption requirements.
</task>
```

---

### 9. `<thinking>` and `<answer>` — OPTIONAL (Chain-of-Thought)

**What it does:** Enables step-by-step reasoning before the final answer.

**Anthropic data:** Reduces errors "especially in math, logic, analysis, or generally complex tasks."

**When to use:** Complex reasoning, multi-step problems, when you want to see Claude's thought process.

```xml
<format>
First, analyze the problem in <thinking> tags:
- Break down the requirements
- Consider edge cases
- Evaluate different approaches

Then provide your final solution in <answer> tags.
</format>
```

---

## The Ideal Prompt Structure

Based on KERNEL + Anthropic + Hostinger best practices:

```xml
<role>
[WHO Claude should be - expertise, tone, perspective]
</role>

<context>
[BACKGROUND information needed to understand the task]
</context>

<task>
[ONE specific, clear goal - the heart of your prompt]
</task>

<constraints>
[BOUNDARIES - what to do, preferences, limitations]
</constraints>

<format>
[HOW the response should be structured]
</format>

<success_criteria>
[MEASURABLE criteria to verify correctness]
</success_criteria>

<examples>
<example>[Input/Output pair 1]</example>
<example>[Input/Output pair 2]</example>
<example>[Input/Output pair 3]</example>
</examples>

<input>
[The actual DATA to process]
</input>
```

---

## Quick Reference: When to Use What

| Situation | Minimum Tags | Recommended Tags |
|-----------|--------------|------------------|
| Simple question | `<task>` | — |
| Code review | `<task>` + `<input>` | + `<constraints>` + `<format>` |
| Content writing | `<task>` + `<context>` | + `<role>` + `<format>` + `<constraints>` |
| Complex analysis | `<task>` + `<input>` | + `<thinking>` + `<success_criteria>` + `<examples>` |
| Long document processing | `<documents>` + `<task>` | + `<format>` (put task at END) |

---

## Comparison: KERNEL vs Hostinger vs Anthropic Official

| Principle | KERNEL | Hostinger | Anthropic Official | Verdict |
|-----------|--------|-----------|-------------------|---------|
| **Clarity** | "Keep it simple" - one goal | Be clear and specific | "Be clear and direct" - treat Claude like a new employee | ✅ All agree |
| **Structure** | Context → Task → Constraints → Format | Lead with instructions | **Use XML tags** (`<instructions>`, `<context>`, `<task>`) | Anthropic adds XML structure |
| **Measurable criteria** | "Easy to verify" - concrete success metrics | Not emphasized | "Define success criteria" - specific, measurable, achievable | ✅ KERNEL + Anthropic align |
| **Scope** | "Narrow scope" - one prompt = one task | Start with core functionality | "Chain complex prompts" - break into subtasks | ✅ All agree |
| **Constraints** | "Explicit constraints" - say what NOT to do | Include limitations | Tell Claude what to do *instead* of what not to do | ⚠️ Anthropic prefers positive framing |
| **Examples** | Not emphasized | Not emphasized | **3-5 diverse examples** in `<example>` tags | Anthropic adds this |
| **Thinking** | Not mentioned | Chain-of-thought | **Let Claude think** - use `<thinking>` tags | Anthropic adds this |
| **Role/Persona** | Not mentioned | Assign personas | **Give Claude a role** via system prompts | Anthropic adds this |
| **Reproducibility** | Avoid temporal references | Not mentioned | Not explicitly mentioned | KERNEL unique point |

---

## KERNEL Framework Recap

**K** - Keep it simple (one clear goal)
**E** - Easy to verify (measurable success criteria)
**R** - Reproducible results (avoid temporal references like "current trends")
**N** - Narrow scope (one prompt = one task)
**E** - Explicit constraints (tell Claude boundaries)
**L** - Legible structure (clear formatting)

---

## Sources

- [Anthropic Prompt Engineering Documentation](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [KERNEL Framework - Reddit](https://www.reddit.com/r/PromptEngineering/comments/1nt7x7v/after_1000_hours_of_prompt_engineering_i_found/)
- [Hostinger Prompt Engineering Best Practices](https://www.hostinger.com/tutorials/prompt-engineering-best-practices)
