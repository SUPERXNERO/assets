class MoneyManager {
  constructor({
    monthsElapsed, monthlyPostCount = 30, oldViews = 2, blogViews, socialViews, blogRPM = .004, socialRPM = .003
  } = {}) {
    this.monthsElapsed = monthsElapsed;
    this.monthlyPostCount = monthlyPostCount;
    this.oldViews = oldViews;
    this.blogViews = blogViews;
    this.socialViews = socialViews;
    this.blogRPM = blogRPM;
    this.socialRPM = socialRPM;
  }
  moneyOfPostsMonth() {
    const blog = (this.blogViews * this.monthlyPostCount) * this.blogRPM;
    const social = (this.socialViews * this.monthlyPostCount) * this.socialRPM;
    return [blog,
      social,
      blog+social];
  }
  allMoneyOfMonth() {
    const blog = this.moneyOfPostsMonth()[0] + (((this.oldViews / (100 / this.blogViews)) * (this.monthlyPostCount * (this.monthsElapsed-1))) * this.blogRPM);
    const social = this.moneyOfPostsMonth()[1] + (((this.oldViews / (100 / this.socialViews)) * (this.monthlyPostCount * (this.monthsElapsed-1))) * this.socialRPM);
    return [blog,
      social,
      blog+social];
  }
}
/*
- test using -

const monthsElapsed = 1;
const moneyManager = new MoneyManager({
  monthsElapsed: monthsElapsed,
  blogViews: 25,
  socialViews: 50,
  oldViews: 5
});
*/