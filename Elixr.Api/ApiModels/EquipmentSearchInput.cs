namespace Elixr.Api.ApiModels
{
    public enum EquipmentSearchMode
    {
        Mundane,
        Enchanted,
        All
    }
    public class EquipmentSearchInput : SearchInput
    {
        public EquipmentSearchMode EquipmentMode { get; set; }
    }
}