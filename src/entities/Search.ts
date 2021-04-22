
export interface ISearch {
  Name: string;
  Tag: string;
  Category: string;
  Cost_for_two: string;
  Timings: string;
  Area: string;
  score: string;
  Address: string;
}

class Search implements ISearch {

  public Name: string;
  public Tag: string;
  public Category: string;
  // tslint:disable-next-line: variable-name
  public Cost_for_two: string;
  public Timings: string;
  public Area: string;
  public score: string;
  public Address: string;

  constructor(params: ISearch) {
    const { Name, Tag, Category, Cost_for_two, Timings, Area, score, Address } = params;
    this.Name = Name;
    this.Tag = Tag;
    this.Category = Category;
    this.Cost_for_two = Cost_for_two;
    this.Timings = Timings;
    this.Area = Area;
    this.score = score;
    this.Address = Address;
  }

}

export default Search;