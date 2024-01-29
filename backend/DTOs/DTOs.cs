using backend.Entities;

namespace backend.DTOs;

public record ChatRoomWithHistoryDto(int Id, IEnumerable<ApplicationUserDto> Members, IEnumerable<HistoryDto> History);

public record AddChatWithUserDto(string Email);

public record ChatRoomCreatedDto(int Id, IEnumerable<ApplicationUserDto> Members);

public record CompleteRegistrationDto(string FirstName, string LastName);