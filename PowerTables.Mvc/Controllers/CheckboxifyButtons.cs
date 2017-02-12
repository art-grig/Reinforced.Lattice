using System.Linq;
using System.Threading;
using System.Web.Mvc;
using Reinforced.Lattice.Adjustments;
using Reinforced.Lattice.Commands;
using Reinforced.Lattice.DebugSink.Models.Data;
using Reinforced.Lattice.DebugSink.Models.Tutorial;
using Reinforced.Lattice.Mvc;
using Reinforced.Lattice.Processing;

namespace Reinforced.Lattice.DebugSink.Controllers
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

        private PartialViewResult LoadComments(LatticeData<Toy, Row> latticeData)
        {
            Thread.Sleep(2000);
            var subject = latticeData.CommandSubject();
            return PartialView("CommentsPartial", subject);
        }

        private TableAdjustment LeaveComment(LatticeData<Toy, Row> latticeData)
        {
            var subject = latticeData.CommandSubject();
            var comment = latticeData.CommandConfirmation<CommentForm>();

            return latticeData.Adjust(x => x.Message(LatticeMessage.User("success", "Comment saved")));
        }

        public ActionResult PricesDetails(LatticeData<Toy, Row> latticeData)
        {
            var confirmation = latticeData.CommandConfirmation<PriceRange>();
            var toys = Data.SourceData.Where(c => (confirmation.StartPrice.HasValue?c.Price > (double) confirmation.StartPrice.Value:true)
                && (confirmation.EndPrice.HasValue ? c.Price < (double)confirmation.EndPrice.Value : true));
            var details = new DetailsModel()
            {
                AveragePrice = (decimal) toys.Select(c=>c.Price).DefaultIfEmpty().Average(),
                ItemsCount = toys.Count()
            };
            return Content("Avg price: " + details.AveragePrice);
        }

        private TableAdjustment RemoveSelected(LatticeData<Toy, Row> arg)
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

        private TableAdjustment UpdateSelected(LatticeData<Toy, Row> arg)
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