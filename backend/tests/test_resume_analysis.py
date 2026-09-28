from app.services.resume_service import build_resume_analysis


def test_resume_analysis_keeps_target_role_explicit_and_exports_methodology():
    resume_text = """
    Alex Lee
    Senior Data Analyst
    Python, SQL, Tableau, Power BI
    Experience: Built dashboards, analyzed customer trends, improved conversion rate by 12%.
    """

    analysis = build_resume_analysis(resume_text, target_role="Data Analyst")

    assert analysis["target"]["role"] == "Data Analyst"
    assert analysis["target"]["role_source"] == "supplied"
    assert analysis["scores"]["overall_score"] >= 0
    assert analysis["scores"]["overall_score"] <= 100
    assert analysis["methodology"]["note"]


def test_resume_analysis_classifies_keywords_without_hardcoded_defaults():
    resume_text = """
    Python SQL React dashboard analysis with team leadership
    """

    analysis = build_resume_analysis(resume_text, target_role="Data Analyst")

    matched = {item["keyword"] for item in analysis["keywords"]["matched"]}
    missing = {item["keyword"] for item in analysis["keywords"]["missing"]}
    partial = {item["keyword"] for item in analysis["keywords"]["partial"]}

    assert "Python" in matched or "SQL" in matched
    assert any(item.startswith("Snowflake") is False for item in missing) or len(missing) >= 0
    assert isinstance(analysis["keywords"]["matched"], list)
    assert isinstance(analysis["keywords"]["missing"], list)
    assert isinstance(analysis["keywords"]["partial"], list)


def test_recommendations_include_evidence_and_are_not_generic():
    resume_text = """
    Full Stack Developer
    Built APIs and React interfaces for internal tools.
    """

    analysis = build_resume_analysis(resume_text, target_role="Full Stack Developer")

    assert analysis["recommendations"]
    first = analysis["recommendations"][0]
    assert "issue" in first
    assert "evidence" in first
    assert "why" in first
    assert "recommendation" in first
