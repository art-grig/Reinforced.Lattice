using System.Linq;
using System.Threading;
using System.Web.Mvc;
using PowerTables.Adjustments;
using PowerTables.Commands;
using PowerTables.Mvc.Models;
using PowerTables.Mvc.Models.Tutorial;
using PowerTables.Processing;

namespace PowerTables.Mvc.Controllers
{
    public partial class TutorialController
    {
        [Tutorial("Checkboxify and simple buttons",1)]
        public ActionResult ButtonsAndCheckboxify()
        {
            return TutPage(c => c.ButtonsAndCheckboxify());
        }

        public ActionResult ButtonsAndCheckboxifyHandle()
        {
            var t = Table();
            t.ButtonsAndCheckboxify();
            var handler = t.CreateMvcHandler(ControllerContext);
            handler.AddCommandHandler(Tutorial.Remove,RemoveSelected);
            handler.AddCommandHandler(Tutorial.Update, UpdateSelected);
            handler.AddCommandHandler("LeaveComment",LeaveComment);
            handler.AddCommandHandler("LoadComments",LoadComments);
            handler.AddCommandHandler("PricesDetails", PricesDetails);
            return handler.Handle(Data.SourceData.AsQueryable());            
        }

        private PartialViewResult LoadComments(PowerTablesData<Toy, Row> powerTablesData)
        {
            Thread.Sleep(2000);
            var subject = powerTablesData.CommandSubject();
            return PartialView("CommentsPartial", subject);
        }

        private TableAdjustment LeaveComment(PowerTablesData<Toy, Row> powerTablesData)
        {
            var subject = powerTablesData.CommandSubject();
            var comment = powerTablesData.CommandConfirmation<CommentForm>();

            return powerTablesData.Adjust(x => x.Message(TableMessage.User("success", "Comment saved")));
        }

        public ActionResult PricesDetails(PowerTablesData<Toy, Row> powerTablesData)
        {
            var confirmation = powerTablesData.CommandConfirmation<PriceRange>();
            var toys = Data.SourceData.Where(c => (confirmation.StartPrice.HasValue?c.Price > (double) confirmation.StartPrice.Value:true)
                && (confirmation.EndPrice.HasValue ? c.Price < (double)confirmation.EndPrice.Value : true));
            var details = new DetailsModel()
            {
                AveragePrice = (decimal) toys.Select(c=>c.Price).DefaultIfEmpty().Average(),
                ItemsCount = toys.Count()
            };
            return Content("Avg price: " + details.AveragePrice);
        }

        private TableAdjustment RemoveSelected(PowerTablesData<Toy, Row> arg)
        {
            //EditionResult er = new EditionResult();
            //var editResultWrapper = new EditionResultWrapper<Row>(er);
            //var selected = arg.Request.GetSelectionIds<int>();
            //foreach (var i in selected)
            //{
            //    editResultWrapper.Adjustments.Remove(new Row() {Id = i});
            //}
            //return new TableUpdateResult(editResultWrapper);
            return null;
        }

        private TableAdjustment UpdateSelected(PowerTablesData<Toy, Row> arg)
        {
            //var form = arg.Request.ConfirmationForm<SimpleConfirmationModel>();
            //EditionResult er = new EditionResult();
            //var editResultWrapper = new EditionResultWrapper<Row>(er);
            //var selected = arg.Request.GetSelectionIds<int>();
            //foreach (var i in selected)
            //{
            //    var data = Data.SourceData.Single(c => c.Id == i);
            //    data.ToyName = form.ToyName;
            //    data.GroupType = form.ToyType.Value;

            //    editResultWrapper.Adjustments.AddOrUpdate(arg.Configuration.Map(data));
            //}
            //return new TableUpdateResult(editResultWrapper);
            return null;
        }
    }
}