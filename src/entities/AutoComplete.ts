
interface IAutoComplete {
  Name: string;
  score: string;
  Category: string;
  Address: string;
}


class AutoComplete implements IAutoComplete {
  Name: string;
  score: string;
  Category: string;
  Address: string;

  constructor(params: IAutoComplete) {
    this.Name = params.Name;
    this.Category = params.Category;
    this.Address = params.Address;
    this.score = params.score;
  }
}