import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0d9488',
  },
  title: {
    fontSize: 12,
    fontWeight: 600,
    color: '#0d9488',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 10,
    lineHeight: 1.6,
    textAlign: 'justify',
  },
  paragraphLast: {
    marginBottom: 0,
  },
});

export function PrognosisDiscussion() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>A Message About Your Care</Text>

      <Text style={styles.paragraph}>
        Discussing hopes, expectations, and prognosis is one of the most difficult parts of cancer care, both for
        you as a patient, and your treating team: doctors, nurses, and all of the people whose work it is to
        help you deal with cancer. It is our hope that this tool will help you to have a conversation with your
        treatment team about very difficult subjects.
      </Text>

      <Text style={styles.paragraph}>
        Your cancer treatment team has developed this worksheet to help you understand what the goals of treatment
        are and to help you have honest and open conversations with us. Please know that this is not intended to
        replace an in-depth discussion, but only to help guide and summarize the discussion, so you and your
        loved ones can best prepare for any possible outcome.
      </Text>

      <Text style={styles.paragraph}>
        Every person and every cancer is unique, but some people find it helpful to have a generalized summary
        of what can typically be expected with the treatment of cancer.
      </Text>

      <Text style={styles.paragraph}>
        Based on your type of cancer and where it has spread, it is not considered to be curable with any
        medical treatment. Although this may be difficult to hear, it is the sad reality that most cancers which
        have spread from where they started, to other parts of the body cannot be cured with surgery, radiation,
        chemotherapy or other treatments. However, for many patients in this situation, there are excellent
        treatment options that can help people to have a very good quality of life and much more time with their
        loved ones than if they had no treatment at all.
      </Text>

      <Text style={styles.paragraph}>
        Many people with cancer want to know, "How much time do I have?" but are afraid to ask. This is also a
        very difficult question for doctors to answer, since no one knows the future and every person is
        different. However, evidence from large groups of people with similar cancers can be used to estimate
        what might happen in your situation.
      </Text>

      <Text style={styles.paragraph}>
        Rather than trying to estimate the amount of time a person might have, many physicians find it more
        helpful to estimate the odds, or likelihood, of living a specific amount of time. For example, most
        people can be almost 100% certain of living through tomorrow, but the odds, even for a healthy person,
        of living 10 years or more is never 100%.
      </Text>

      <Text style={styles.paragraph}>
        For another example, an otherwise healthy 75 year old man has about a 50/50 chance of making it to
        age 85. That does not mean he has 10 years to live, but that half the men his age will live more, and
        half will live less. For people with cancer, estimates of how likely a person is to live 6 months, one
        year, two years, or five years can be approximated based on scientific studies and your doctor's
        assessment of your case, and that is one purpose of this discussion tool.
      </Text>

      <Text style={styles.paragraph}>
        Because we care about you and your loved ones, we want you to understand as clearly as possible what
        typically happens in situations like yours. In no way do we want to diminish any hope for beating the
        odds, dramatic successes, and even miracles. We have all seen patients that do much, much better than
        we ever expected, and we would want that to happen in your case.
      </Text>

      <Text style={[styles.paragraph, styles.paragraphLast]}>
        As you think about and prepare for the future, please tell us how we can assist you in this journey.
      </Text>
    </View>
  );
}
